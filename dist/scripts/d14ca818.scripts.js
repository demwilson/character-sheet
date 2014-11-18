"use strict";function Character(data){function Bonus(data){data=_.defaultValue({value:0,type:"untyped",target:"none"},data),this.value=data.value,this.type=data.type,this.target=data.target,this.toString=function(){return _.sprintf("%+d%s%s",this.value)}}function BonusSet(data){_.isUndefined(data.bonus)||(data.bonuses=[data.bonus]),data=_.defaultValue({name:"Unnamed",bonuses:[]},data),_.each(data.bonuses,function(bonus,index){this[index]=new Bonus(bonus)},data.bonuses),this.name=data.name,this.active=data.active,this.canToggle=!_.isUndefined(data.active),this.locked=data.locked,this.getTargetting=function(targetID){if(this.active===!1)return{};var found=_.filter(data.bonuses,function(bonus){return bonus.target===targetID});return _.isEmpty(found)?{}:_.max(found,function(bonus){return bonus.value})}}function Score(data){this.name=data.name,this.id=_(this.name).underscored(),this.exemptTypes=[],this._exemptTypes=function(){_.each(data.exemptTypes,function(type){if(0===type.indexOf("-")){var toRemoveIndex=this.exemptTypes.indexOf(type.slice(1));_.isUndefined(toRemoveIndex)||this.exemptTypes.splice(toRemoveIndex,1)}else isValidBonusType(type,this.exemptTypes)&&this.exemptTypes.push(type)},this)},this.stats=data.stats,data.stat&&(this.stats=[data.stat]),this.getTotal=function(){var total;return _.isNumber(data.base)&&(total=data.base),total+=bonusHandler.getBonus(this.id,this.exemptTypes)},this.getRoll=function(){return _.sprintf("%+d",this.getTotal())}}function AbilityScore(data){Score.call(this,data),this.exemptTypes=["armor","deflection","dodge","natural armor","shield"],this._exemptTypes(),this.getTotal=function(exemptTemporary){var total=data.base;if(total+=bonusHandler.getBonus(this.id,this.exemptTypes),exemptTemporary!==!0&&(total+=bonusHandler.getBonus(this.id+"_temporary",this.exemptTypes)),"dexterity"===this.id){var maxDex=2*bonusHandler.getMaxDex()+11;if(total>maxDex)return maxDex}return total},this.getModifier=function(factor,exemptTemporary){factor=factor||1;var modifier=Math.floor((this.getTotal(exemptTemporary)-10)/2);return Math.floor(modifier*factor)},this.getRoll=function(){return _.sprintf("%+d",this.getModifier())}}function Attack(data,def){data=_.defaultValue(def||{},data),Score.call(this,data),this.exemptTypes=["armor","deflection","dodge","natural armor","shield"],this._exemptTypes(),this.getToHit=function(){var bab=data.bab,total=this.getTotal();total+=abilityScores.getModifiers(data.stats),total+=bonusHandler.getBonus("to_hit",this.exemptTypes),total+=bonusHandler.getBonus(this.id+"_to_hit",this.exemptTypes),total+=bonusHandler.getBonus(data.range+"_to_hit",this.exemptTypes);var rolls=_.sprintf("%+d",bab+total);if("natural"===data.type)return rolls;for(var itterative=bab-5;itterative>0;itterative-=5)rolls+=_.sprintf("/%+d",itterative+total);return rolls},this.getDice=function(){var dieSteps=0;if(dieSteps+=bonusHandler.getBonus("dice_step"),dieSteps+=bonusHandler.getBonus("melee_dice_step"),dieSteps+=bonusHandler.getBonus(this.id+"_melee_dice_step"),dieSteps+=bonusHandler.getBonus("ranged_dice_step"),dieSteps+=bonusHandler.getBonus(this.id+"_ranged_dice_step"),0===dieSteps)return data.dice;var dice=data.dice.split("+");for(dieSteps;dieSteps>0;dieSteps--){var die={count:parseInt(dice[0].split("d")[0]),size:parseInt(dice[0].split("d")[1])};if(die.count<3)switch(dice[0]){case"1d3":dice[0]="1d4";break;case"1d4":dice[0]="1d6";break;case"1d6":dice[0]="1d8";break;case"1d8":dice[0]="2d6";break;case"1d10":dice[0]="2d6";break;case"1d12":dice[0]="3d6";break;case"2d4":dice[0]="2d6";break;case"2d6":dice[0]="3d6";break;case"2d8":dice[0]="3d8";break;case"2d10":dice[0]="4d8"}else die.count=Math.floor(1.5*die.count),dice[0]=""+die.count+"d"+die.size}return dice.join("+")},this.getCrit=function(){return _.isNumber(data.crit)?"/x"+data.crit:_.isString(data.crit)?"/"+data.crit:""},this.getDamage=function(){if(data.noDamage)return!1;var dice=_.defaultValue("",data.damage),total=0,factor=data.factor||1,stats=data.damageStats,range=data.range;return data.damageBase&&(total+=data.damageBase),_.contains(stats,"strength")&&(total+=abilityScores.getModifier("strength",factor)),total+=abilityScores.getModifiers(_.without(stats,"strength")),total+=bonusHandler.getBonus("damage",this.exemptTypes),total+=bonusHandler.getBonus(this.id+"_damage",this.exemptTypes),total+=bonusHandler.getBonus(range+"_damage",this.exemptTypes),total+=bonusHandler.getBonus(range+"_strength_like_damage",this.exemptTypes,factor),0===total?dice:(total=_.sprintf("%+d",total),this.getDice()+total+this.getCrit())}}function Defense(data,def){data=_.defaultValue(def||{},data),Score.call(this,data),this.exemptTypes=["alchemical","circumstance","competence","inherent","morale","resistance"],this._exemptTypes(),data.base=_.defaultValue(10,data.base)+_.defaultValue(0,data.bab),data.touch=_.defaultValue({id:"touch_",stats:["dexterity"],exemptTypes:["armor","shield","natural armor"]},data.touch),data.flatfooted=_.defaultValue({id:"flat_footed_",stats:["strength"],exemptTypes:["dodge"]},data.flatfooted),this.getTotal=function(){var total=data.base;return total+=abilityScores.getModifiers(data.stats),total+=bonusHandler.getBonus(this.id,this.exemptTypes)},this._getSpecialDefense=function(specialData){var total=data.base,stats=_.flatten(_.intersection(data.stats,specialData.stats)),exemptTypes=_.flatten([this.exemptTypes,specialData.exemptTypes]);return total+=abilityScores.getModifiers(stats),total+=bonusHandler.getBonus(this.id,exemptTypes),total+=bonusHandler.getBonus(specialData.id+this.id,exemptTypes)},this.getTouch=function(){return this._getSpecialDefense(data.touch)},this.getFlatFooted=function(){return this._getSpecialDefense(data.flatfooted)},this.toString=function(){var strings=bonusHandler.getBonusStrings(this.id);return _.each(data.stats,function(statName){var roll=abilityScores.getRoll(statName,":");"+0"!==roll&&strings.push(roll+":"+statName.slice(0,3))}),_.isNumber(data.bab)&&0!==data.bab&&strings.push(_.sprintf("%+d",data.bab)+":bab"),strings=_.sortBy(strings,function(string){var name=string.split(":")[1];return name}),_.each(strings,function(string,index){this[index]=string.replace(":"," ")},strings),strings.join(", ")}}function Save(data,def){data=_.defaultValue(def||{},data),Score.call(this,data),this.exemptTypes=["armor","circumstance","deflection","dodge","inherent","natural armor","shield","size"],this._exemptTypes(),this.getTotal=function(){var total=data.base;return total+=abilityScores.getModifiers(data.stats),total+=bonusHandler.getBonus(this.id,this.exemptTypes),total+=bonusHandler.getBonus("saves",this.exemptTypes)}}function Skill(data){Score.call(this,data),data.name.indexOf(" (")>-1&&(data.baseID=_.underscored(data.name.slice(0,data.name.indexOf(" (")))),this.getTotal=function(){var total=abilityScores.getModifiers(this.stats);return total+=bonusHandler.getBonus(this.id,this.exemptTypes),data.baseID&&(total+=bonusHandler.getBonus(data.baseID,this.exemptTypes)),data.ranks&&(total+=data.ranks),data.classSkill&&data.ranks>0&&(total+=3),data.acp&&(total+=bonusHandler.getBonus("armor_check_penalty",this.exemptTypes)),total},this.isTrained=function(){return data.ranks>0}}function Caster(data){this.md=data.markdown,this.name=data.name,this.id=_(this.name).underscored(),this.type=_.capitalize(data.type),this.baseSpells=_.defaultValue([],data.baseSpells),data.stat&&(data.stats=[data.stat]),this.stats=data.stats,this.getCasterLevel=function(){var casterLevel=0;return casterLevel+=that.classes[data.name],casterLevel+=bonusHandler.getBonus("caster_level"),casterLevel+=bonusHandler.getBonus(data.name.toLowerCase()+"_caster_level")},this.getCasterLevelRoll=function(){return _.sprintf("%+d",this.getCasterLevel())},this.getConcentrationRoll=function(){var concentration=0;return concentration+=this.getCasterLevel(),concentration+=abilityScores.getModifiers(this.stats),concentration+=bonusHandler.getBonus("concentration"),concentration+=bonusHandler.getBonus(this.id+"_concentration"),_.sprintf("%+d",concentration)},this.getSpellResistanceRoll=function(){var spellResistance=0;return spellResistance+=this.getCasterLevel(),spellResistance+=bonusHandler.getBonus("spell_resistance"),spellResistance+=bonusHandler.getBonus(this.id+"_spell_resistance"),_.sprintf("%+d",spellResistance)}}function SLA(data){this.md=data.markdown,this.name=data.name,this.level=data.level||1,data.stat&&(data.stats=[data.stat]),this.stats=data.stats,this.concentration=new Skill(_.defaultValue({name:_.sprintf("%s Concentration",data.name),ranks:that.classes[data.name],stats:data.stats||["charisma"]},data.concentration)),this.spellResistance=new Skill(_.defaultValue({name:_.sprintf("%s Overcome Spell Resistance",data.name),ranks:that.classes[data.name],stats:data.stats||["charisma"]}))}var that=this,bonusHandler={data:_.map(data.bonuses,function(bonus){return new BonusSet(bonus)}),getTypes:function(targetID,exempt,factor){_.isArray(exempt)||(exempt=[]),factor=factor||1;var bonuses=_.map(this.data,function(bonusSet){return bonusSet.getTargetting(targetID)}),types=_.groupBy(bonuses,function(bonus){return bonus.type}),typeTotal={};return _.each(types,function(type,typeName){if(isValidBonusType(typeName,exempt))if(typeTotal[typeName]=0,bonusHandler.canStack(typeName))_.each(type,function(bonus){var value=bonus.value;typeTotal[typeName]+=0>value?value:Math.floor(bonus.value*factor)});else{var values=_.map(type,function(bonus){return bonus.value>=0?bonus.value:0});_.isEmpty(values)||(typeTotal[typeName]+=Math.floor(_.max(values)*factor)),values=_.map(type,function(bonus){return bonus.value<0?bonus.value:0}),typeTotal[typeName]+=_.reduce(values,function(sum,x){return sum+x},0)}}),typeTotal},getBonus:function(targetID,exempt,factor){var types=this.getTypes(targetID,exempt,factor);return _.reduce(types,function(sum,x){return sum+x},0)},getBonusStrings:function(targetID,exempt,factor){var types=this.getTypes(targetID,exempt,factor);return _.compactMap(types,function(bonus,type){return 0!==bonus?_.sprintf("%+d:%s",bonus,type.replace("_"," ")):void 0})},getMaxDex:function(){var bonuses=_.map(this.data,function(bonusSet){return bonusSet.getTargetting("maximum_dexterity")});return _.min(bonuses,function(bonus){return bonus.value}).value},canStack:function(type){var stackable=["circumstance","dodge","racial","untyped"];return stackable.indexOf(type)>-1}};if(this.bonuses=bonusHandler.data,this.name=data.name||"Unnamed",this.id=_(this.name).underscored(),data.cr&&data.mr?this.difficulty=_.sprintf("CR %d / MR %d",data.cr,data.mr):data.cr?this.difficulty=_.sprintf("CR %d",data.cr):data.mr&&(this.difficulty=_.sprintf("MR %d",data.mr)),_.isString(data.xp)){var temp=data.xp.split("/");_.each(temp,function(val,index){this[index]=_.numberFormat(parseInt(val))},temp),this.xp=_.sprintf("XP %s/%s",temp[0],temp[1])}_.isNumber(data.xp)&&(this.xp="XP "+_.numberFormat(data.xp)),this.classes=data.classes,this.initiative=new Skill(_.defaultValue({name:"Initiative",stats:["dexterity"],base:0},data.initiative)),this.senses=stringify(data.senses),this.aura=stringify(data.aura),this.hp=_.sprintf("%d (%s)",data.hp||1/0,data.hd||""),this.hpSpecial=stringify(data.hpSpecial),this.speed=data.speed,this.space=data.space,this.reach=data.reach,this.infoText=[stringify([data.templates,data.race,stringify(data.classes,"/")]," "),stringify([data.alignment,data.size,data.type]," ")],this.feats=stringify(data.feats),this.traits=stringify(data.traits),this.languages=stringify(data.languages),this.specialQualities=markdownArray(data.specialQualities),this.environment=markdownArray(data.environment),this.organization=markdownArray(data.organization),this.specialAbilities=markdownArray(data.specialAbilities),this.treasure=markdownArray(data.treasure);var abilityScores=_.defaultValue({strength:10,dexterity:10,constitution:10,intelligence:10,wisdom:10,charisma:10},data.abilityScores);abilityScores={strength:new AbilityScore({name:"Strength",base:abilityScores.strength}),dexterity:new AbilityScore({name:"Dexterity",base:abilityScores.dexterity}),constitution:new AbilityScore({name:"Constitution",base:abilityScores.constitution}),intelligence:new AbilityScore({name:"Intelligence",base:abilityScores.intelligence}),wisdom:new AbilityScore({name:"Wisdom",base:abilityScores.wisdom}),charisma:new AbilityScore({name:"Charisma",base:abilityScores.charisma})},abilityScores.getModifier=function(scoreID,factor,exemptTemporary){factor=factor||1;var modifier=this[scoreID].getModifier(factor,exemptTemporary);return 0>modifier?modifier:modifier},abilityScores.getRoll=function(scoreID){return this[scoreID].getRoll()},abilityScores.getModifiers=function(scoreIDs,factor,exemptTemporary){var modifiers=[];return _.each(scoreIDs,function(scoreID,index){this[index]=abilityScores.getModifier(scoreID,factor,exemptTemporary)},modifiers),_.reduce(modifiers,function(a,b){return a+b},0)},this.abilityScores=function(){return[abilityScores.strength,abilityScores.dexterity,abilityScores.constitution,abilityScores.intelligence,abilityScores.wisdom,abilityScores.charisma]},this.bab=new Attack({name:"Base Attack Bonus",bab:0,base:_.defaultValue(0,data.baseAttackBonus),stats:[]}),this.cmb=new Attack(data.combatManeuverBonus,{name:"Combat Maneuver Bonus",bab:this.bab.getTotal(),base:0,stats:["strength"]});var attacks=_.defaultValue({melee:[],ranged:[],special:[]},data.attacks);this.meleeAttacks=_.map(attacks.melee,function(attack){return new Attack(attack,{range:"melee",type:"weapon",bab:that.bab.getTotal(),base:0,stats:["strength"],damageStats:["strength"]})}),this.rangedAttacks=_.map(attacks.ranged,function(attack){return new Attack(attack,{range:"ranged",type:"weapon",bab:that.bab.getTotal(),base:0,stats:["dexterity"]})}),this.specialAttacks=_.map(attacks.special,function(attack){return new Attack(attack,{range:"special",type:"special",bab:that.bab.getTotal(),base:0,stats:[]})}),this.spells=_.map(data.spells,function(caster){return new Caster(caster)}),this.spellLikeAbilities=_.map(data.spellLikeAbilities,function(caster){return new SLA(caster)});var defense=data.defense||{};this.ac=new Defense(defense.ac,{name:"Armor Class",stats:["dexterity"],exemptTypes:[]}),this.cmd=new Defense(defense.cmd,{name:"Combat Maneuver Defense",stats:["strength","dexterity"],bab:this.bab.getTotal(),exemptTypes:["armor","shield","natural armor"]});var saves=_.defaultValue({fortitude:{},reflex:{},will:{},special:void 0},data.saves);this.saves={fortitude:new Save(saves.fortitude,{name:"Fortitude",stats:["constitution"],base:0}),reflex:new Save(saves.reflex,{name:"Reflex",stats:["dexterity"],base:0}),will:new Save(saves.will,{name:"Will",stats:["wisdom"],base:0}),special:stringify(saves.special)},this.dr=stringify(data.dr),this.immune=stringify(data.immune),this.resist=stringify(data.resist),this.sr=stringify(data.sr),this.defensive=stringify(data.defensive),this.weaknesses=stringify(data.weaknesses),_.each(data.skills,function(skill,skillIndex){this[skillIndex]=new Skill(skill)},data.skills),this.skills={},this.skills.trained=_.filter(data.skills,function(skill){return skill.isTrained()}),this.skills.untrained=_.filter(data.skills,function(skill){return!skill.isTrained()}),this.skills.get=function(skillID){var trained=_.findWhere(this.trained,{id:skillID}),untrained=_.findWhere(this.untrained,{id:skillID});return trained||untrained||new Skill({name:"Dummy Skill"})},this.pf={name:this.name,level:function(className,factor){return factor=factor||1,Math.floor(that.classes[className]*factor)},modifier:function(stat,factor,exemptTemporary){return factor=factor||1,abilityScores.getModifier(stat,factor,exemptTemporary)},spellDC:function(className,level,bonus){bonus=_.defaultValue(0,bonus);var caster=_.findWhere(that.spells,function(caster){return caster.name===className}),dc=10+level+abilityScores.getModifiers(caster.stats)+bonus;return _.sprintf("DC %d",dc)},spellsPerDay:function(className,spellLevel){var spells=null,caster=_.findWhere(that.spells,function(caster){return caster.name===className});if(!_.isUndefined(caster)&&(spells=caster.baseSpells[spellLevel],0!==spellLevel)){var modifier=abilityScores.getModifier(caster.stats);spells+=Math.ceil((1+modifier-spellLevel)/4)}return spells},classDC:function(className,stat,factor,min){factor=factor||.5,min=min||1;var classLevel=Math.floor(that.classes[className]*factor)||min;return _.sprintf("DC %d",10+classLevel+abilityScores.getModifier(stat))}},this.options=data.options}var isValidBonusType=function(type,exempt){var types=["alchemical","armor","circumstance","competence","deflection","dodge","enhancement","inherent","insight","luck","morale","natural_armor","profane","racial","resistance","sacred","shield","size","trait","untyped"];return-1!==types.indexOf(type)&&-1===exempt.indexOf(type)},markdownArray=function(things){return _.isArray(things)||(things=[things]),_.compactMap(things,function(thing){return _.isString(thing)?thing.indexOf("@")>0?null:thing:null})},stringify=function(things,separator){function _stringify(things){var str="";return _.isNumber(things)?str=things.toString():_.isString(things)?str=things:_.isArray(things)?_.each(things,function(thing){_.isUndefined(thing)||(str+=_stringify(thing)+separator)}):_.isObject(things)&&(things.link&&things.text?str+=_.sprintf("[%s](%s)",things.text,things.link):str=_stringify(_.map(things,function(thing,thingKey){return _.sprintf("%s %s",thingKey,thing)}))),str}if(_.isUndefined(things))return void 0;separator=separator||", ";var str=_stringify(things);return str.slice(-separator.length)===separator?str.slice(0,-separator.length):str};_.mixin({compactMap:function(list,iteratee,context){return _.compact(_.map(list,iteratee,context))},defaultValue:function(value,param){return _.isObject(value)?_.extend(value,param):_.isUndefined(param)?value:param}}),_.mixin(_.str.exports());var app=angular.module("charactersApp",["ngRoute","ngSanitize"]);app.config(["$compileProvider","$routeProvider",function($compileProvider,$routeProvider){$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|file|blob):|data:image\//),$routeProvider.when("/",{templateUrl:"views/main.html",controller:"MainCtrl",reloadOnSearch:!1}).when("/:characterId",{templateUrl:"views/character.html",controller:"CharacterCtrl",reloadOnSearch:!1}).otherwise({redirectTo:"/",reloadOnSearch:!1})}]),app.run([function(){FastClick.attach(document.body)}]),app.controller("MainCtrl",["$http","$scope","$window",function($http,$scope,$window){$window.document.title="Character Sheets",$http.get("characters/_list.json").success(function(data){$scope.characters=data})}]),app.controller("CharacterCtrl",["$http","$routeParams","$scope","$window",function($http,$routeParams,$scope,$window){$scope.characters=[],$http.get("characters/"+$routeParams.characterId+"/_data.json").success(function(data){_.each(data,function(characterData,index){this[index]=new Character(characterData)},$scope.characters),$window.document.title=$scope.characters[0].name+" - Character Sheet"})}]),marked.setOptions({renderer:new marked.Renderer,gfm:!0,tables:!0,breaks:!1,pedantic:!1,smartLists:!0,smartypants:!1}),app.directive("md",["$compile","$http","$routeParams",function($compile,$http,$routeParams){return{restrict:"E",scope:{pf:"=",md:"="},templateUrl:"views/directives/md.html",link:function($scope,$element){if(void 0===$scope.md)return void 0;$scope.Math=Math;var alias=function(markdown,aliases){return _.each(aliases,function(alias){markdown=markdown.replace(alias.re,alias.text)}),markdown},render=function(){var pre=[{re:/\{\{/g,text:"`<ng-bind>"},{re:/\}\}/g,text:"</ng-bind>`"}],markdown=alias($scope.md.join("\n\n"),pre),html=marked(markdown),post=[{re:/<code>&lt;ng-bind&gt;/g,text:"{{"},{re:/&lt;\/ng-bind&gt;<\/code>/g,text:"}}"},{re:/unprepared/g,text:'<span class="unprepared">unprepared</span>'},{re:/\^([^\^]*)\^/g,text:"<sup>$1</sup>"},{re:/\$([^\$]*)\$/g,text:"<small>$1</small>"},{re:/\@([^\@]*)\@/g,text:"<roll>$1</roll>"},{re:/<a/g,text:'<a target="_blank"'},{re:/target="_blank" href="#/g,text:'href="#/'+$routeParams.characterId+"#"},{re:/:d20:/g,text:"http://www.d20pfsrd.com/"},{re:/:d20-spell:([a-z])/g,text:"http://www.d20pfsrd.com/magic/all-spells/$1/$1"},{re:/:d20-feat-([^\:]*):/g,text:"http://www.d20pfsrd.com/feats/$1-feats/"},{re:/:d20-trait-([^\:]*):/g,text:"http://www.d20pfsrd.com/traits/$1-traits/"},{re:/:d20-wop-effect:/g,text:"http://www.d20pfsrd.com/magic/variant-magic-rules/words-of-power/effect-words/"},{re:/:d20-wop-meta:/g,text:"http://www.d20pfsrd.com/magic/variant-magic-rules/words-of-power/meta-words/"},{re:/:d20-wop-target:/g,text:"http://www.d20pfsrd.com/magic/variant-magic-rules/words-of-power/target-words/"},{re:/:d20-special-abilities:/g,text:"http://www.d20pfsrd.com/gamemastering/special-abilities#TOC-"},{re:/:d20-creature-types:/g,text:"http://www.d20pfsrd.com/bestiary/rules-for-monsters/creature-types#TOC-"},{re:/:d20-universal-monster-rules:/g,text:"http://www.d20pfsrd.com/bestiary/rules-for-monsters/universal-monster-rules#TOC-"},{re:/:nethys-([^\:]*):/g,text:"http://www.archivesofnethys.com/$1Display.aspx?ItemName="},{re:/:prd-spell-crb:([a-zA-Z]+)/g,text:"http://paizo.com/pathfinderRPG/prd/spells/$1.html"},{re:/:prd-spell-apg:([a-zA-Z]+)/g,text:"http://paizo.com/pathfinderRPG/prd/advanced/spells/$1.html"},{re:/:prd-spell-uc:([a-zA-Z]+)/g,text:"http://paizo.com/pathfinderRPG/prd/ultimateCombat/spells/$1.html"},{re:/:prd-spell-um:([a-zA-Z]+)/g,text:"http://paizo.com/pathfinderRPG/prd/ultimateMagic/spells/$1.html"},{re:/:prd-spell-acg:([a-zA-Z]+)/g,text:"http://paizo.com/pathfinderRPG/prd/advancedClassGuide/spells/$1.html"}];return $scope.isText===!0?post=post.concat([{re:/<p/g,text:"<span"},{re:/<\/p>/g,text:"</span>"}]):html='<div class="no-break">'+html+"</div>",html=alias(html,post)},unbindWatcher=$scope.$watch("isReady",function(){if($scope.isReady===!0){var el=angular.element(render());$compile(el)($scope),$element.prepend(el),unbindWatcher()}});if($scope.md.indexOf(".md")>-1){$scope.md=$scope.md.split("+");var remainingMarkdown=$scope.md.length;_.each($scope.md,function(uri,index){-1===uri.indexOf("@")&&$http.get(_.sprintf("characters/%s/%s",$routeParams.characterId,uri)).success(function(data){$scope.md[index]=data,remainingMarkdown--,0===remainingMarkdown&&($scope.isReady=!0)})})}else $scope.md=[$scope.md],$scope.isReady=!0,$scope.isText=!0}}}]);