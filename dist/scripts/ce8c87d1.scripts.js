"use strict";function Character(data){function Bonus(data){data=_.defaultValue({value:0,type:"untyped",target:"none"},data),this.value=data.value,this.type=data.type,this.target=data.target,this.toString=function(){return _.sprintf("%+d%s%s",this.value)}}function BonusSet(data){data=_.defaultValue({name:"Unnamed",bonuses:[]},data),_.each(data.bonuses,function(bonus,index){this[index]=new Bonus(bonus)},data.bonuses),this.name=data.name,this.active=data.active,this.canToggle=!_.isUndefined(data.active),this.locked=data.locked,this.getTargetting=function(targetID){if(this.active===!1)return{};var found=_.filter(data.bonuses,function(bonus){return bonus.target===targetID});return _.isEmpty(found)?{}:_.max(found,function(bonus){return bonus.value})},this.getBonusString=function(targetID){var bonus=this.getTargetting(targetID);return _.isUndefined(bonus.value)||0===bonus.value?"":_.sprintf("%+d:%s",bonus.value,bonus.type)}}function Score(data){this.name=data.name,this.id=_(this.name).underscored(),this.exemptTypes=[],this._exemptTypes=function(){_.each(data.exemptTypes,function(type){if(0===type.indexOf("-")){var toRemoveIndex=this.exemptTypes.indexOf(type.slice(1));_.isUndefined(toRemoveIndex)||this.exemptTypes.splice(toRemoveIndex,1)}else isValidBonusType(type,this.exemptTypes)&&this.exemptTypes.push(type)},this)},this.stats=data.stats,data.stat&&(this.stats=[data.stat]),this.getTotal=function(){var total;return _.isNumber(data.base)&&(total=data.base),total+=bonusHandler.getBonus(this.id,this.exemptTypes)},this.getRoll=function(){return _.sprintf("%+d",this.getTotal())}}function AbilityScore(data){Score.call(this,data),this.exemptTypes=["armor","deflection","dodge","natural armor","shield"],this._exemptTypes(),this.getTotal=function(){var total=data.base+bonusHandler.getBonus(this.id,this.exemptTypes);if("dexterity"===this.id){var maxDex=2*bonusHandler.getMaxDex()+11;if(total>maxDex)return maxDex}return total},this.getModifier=function(factor){factor=factor||1;var modifier=Math.floor((this.getTotal()-10)/2);return Math.floor(modifier*factor)},this.getRoll=function(){return _.sprintf("%+d",this.getModifier())}}function Attack(data,def){data=_.defaultValue(def||{},data),Score.call(this,data),this.exemptTypes=["armor","deflection","dodge","natural armor","shield"],this._exemptTypes(),this.getToHit=function(){var bab=data.bab,total=this.getTotal();total+=abilityScores.getModifiers(data.stats),total+=bonusHandler.getBonus(this.id+"_to_hit",this.exemptTypes),total+=bonusHandler.getBonus(data.range+"_to_hit",this.exemptTypes);var rolls=_.sprintf("%+d",bab+total);if("natural"===data.type)return rolls;for(var itterative=bab-5;itterative>0;itterative-=5)rolls+=_.sprintf("/%+d",itterative+total);return rolls},this.getDamage=function(){if(data.noDamage)return!1;var dice=_.defaultValue("",data.damageDice),total=0,factor=data.damageFactor||1,stats=data.damageStats,range=data.range;if(data.damageBase&&(total+=data.damageBase),_.contains(stats,"strength")&&(total+=abilityScores.getModifier("strength",factor)),total+=abilityScores.getModifiers(_.without(data.damageStats,"strength")),total+=bonusHandler.getBonus("damage",this.exemptTypes),total+=bonusHandler.getBonus(this.id+"_damage",this.exemptTypes),total+=bonusHandler.getBonus(range+"_damage",this.exemptTypes),total+=bonusHandler.getBonus(range+"_strength_like_damage",this.exemptTypes,factor),0===total)return dice;if(total=_.sprintf("%+d",total),_.contains(dice,"/")){var index=dice.indexOf("/");return _(dice).insert(index,total)}return dice+total}}function Defense(data,def){data=_.defaultValue(def||{},data),Score.call(this,data),this.exemptTypes=["alchemical","circumstance","competence","inherent","morale","resistance"],this._exemptTypes(),data.base=_.defaultValue(10,data.base)+_.defaultValue(0,data.bab),data.touch=_.defaultValue({id:"touch_",stats:["dexterity"],exemptTypes:["armor","shield","natural armor"]},data.touch),data.flatfooted=_.defaultValue({id:"flat_footed_",stats:["strength"],exemptTypes:[]},data.flatfooted),this.getTotal=function(){var total=data.base;return total+=abilityScores.getModifiers(data.stats),total+=bonusHandler.getBonus(this.id,this.exemptTypes)},this._getSpecialDefense=function(specialData){var total=data.base,stats=_.flatten(_.intersection(data.stats,specialData.stats)),exemptTypes=_.flatten([this.exemptTypes,specialData.exemptTypes]);return total+=abilityScores.getModifiers(stats),total+=bonusHandler.getBonus(this.id,exemptTypes),total+=bonusHandler.getBonus(specialData.id+this.id,exemptTypes)},this.getTouch=function(){return this._getSpecialDefense(data.touch)},this.getFlatFooted=function(){return this._getSpecialDefense(data.flatfooted)},this.toString=function(){var strings=bonusHandler.getBonusStrings(this.id);return _.each(data.stats,function(statName){var roll=abilityScores.getRoll(statName,":");"+0"!==roll&&strings.push(roll+":"+statName.slice(0,3))}),_.isNumber(data.bab)&&0!==data.bab&&strings.push(_.sprintf("%+d",data.bab)+":bab"),strings=_.sortBy(strings,function(string){var name=string.split(":")[1];return name}),_.each(strings,function(string,index){this[index]=string.replace(":"," ")},strings),strings.join(", ")}}function Save(data,def){data=_.defaultValue(def||{},data),Score.call(this,data),this.exemptTypes=["armor","circumstance","deflection","dodge","inherent","natural armor","shield","size"],this._exemptTypes(),this.getTotal=function(){var total=data.base;return total+=abilityScores.getModifiers(data.stats),total+=bonusHandler.getBonus(this.id,this.exemptTypes),total+=bonusHandler.getBonus("saves",this.exemptTypes)}}function Skill(data){Score.call(this,data),data.name.indexOf(" (")>-1&&(data.baseID=_.underscored(data.name.slice(0,data.name.indexOf(" (")))),this.getTotal=function(){var total=abilityScores.getModifiers(this.stats);return total+=bonusHandler.getBonus(this.id,this.exemptTypes),data.baseID&&(total+=bonusHandler.getBonus(data.baseID,this.exemptTypes)),(_.contains(data.stats,"strength")||_.contains(data.stats,"dexterity"))&&(total+=bonusHandler.getBonus("armor-check-penalty",this.exemptTypes)),data.ranks&&(total+=data.ranks),data.classSkill&&data.ranks>0&&(total+=3),total},this.isTrained=function(){return data.ranks>0}}function Caster(data){this.md=data.markdown,this.name=data.name,this.type=_.capitalize(data.type),this.level=_.sprintf("%+d",that.classes[data.name]),data.stat&&(data.stats=[data.stat]),this.stats=data.stats,this.concentration=new Skill(_.defaultValue({name:_.sprintf("%s Concentration",data.name),ranks:that.classes[data.name],stats:data.stats||["charisma"]},data.concentration)),this.spellResistance=new Skill(_.defaultValue({name:_.sprintf("%s Overcome Spell Resistance",data.name),ranks:that.classes[data.name],stats:data.stats||["charisma"]}))}function SLA(data){this.md=data.markdown,this.name=data.name,this.level=data.level||1,data.stat&&(data.stats=[data.stat]),this.stats=data.stats,this.concentration=new Skill(_.defaultValue({name:_.sprintf("%s Concentration",data.name),ranks:that.classes[data.name],stats:data.stats||["charisma"]},data.concentration)),this.spellResistance=new Skill(_.defaultValue({name:_.sprintf("%s Overcome Spell Resistance",data.name),ranks:that.classes[data.name],stats:data.stats||["charisma"]}))}var that=this,bonusHandler={data:_.map(data.bonuses,function(bonus){return new BonusSet(bonus)}),getTypes:function(targetID,exempt,factor){_.isArray(exempt)||(exempt=[]),factor=factor||1;var bonuses=_.map(this.data,function(bonusSet){return bonusSet.getTargetting(targetID)}),types=_.groupBy(bonuses,function(bonus){return bonus.type}),typeTotal={};return _.each(types,function(type,typeName){if(isValidBonusType(typeName,exempt))if(typeTotal[typeName]=0,bonusHandler.canStack(typeName))_.each(type,function(bonus){var value=bonus.value;typeTotal[typeName]+=0>value?value:Math.floor(bonus.value*factor)});else{var values=_.map(type,function(bonus){return bonus.value>=0?bonus.value:0});_.isEmpty(values)||(typeTotal[typeName]+=Math.floor(_.max(values)*factor)),values=_.map(type,function(bonus){return bonus.value<0?bonus.value:0}),typeTotal[typeName]+=_.reduce(values,function(sum,x){return sum+x},0)}}),typeTotal},getBonus:function(targetID,exempt,factor){var types=this.getTypes(targetID,exempt,factor);return _.reduce(types,function(sum,x){return sum+x},0)},getBonusStrings:function(targetID,exempt,factor){var types=this.getTypes(targetID,exempt,factor);return _.compactMap(types,function(bonus,type){return _.sprintf("%+d:%s",bonus,type)})},getMaxDex:function(){var bonuses=_.map(this.data,function(bonusSet){return bonusSet.getTargetting("max_dex")});return _.min(bonuses,function(bonus){return bonus.value}).value},canStack:function(type){var stackable=["circumstance","dodge","racial","untyped"];return stackable.indexOf(type)>-1}};this.name=data.name||"",this.id=_(this.name).underscored(),this.portrait=data.portrait||"",this.bonuses=bonusHandler.data,data.cr&&data.mr?this.difficulty=_.sprintf("CR %d / MR %d",data.cr,data.mr):data.cr?this.difficulty=_.sprintf("CR %d",data.cr):data.mr&&(this.difficulty=_.sprintf("MR %d",data.mr)),data.xp&&(this.xp=data.xp.awarded?"XP "+_.numberFormat(data.xp.awarded):_.sprintf("XP %s / %s",_.numberFormat(data.xp.current),_.numberFormat(data.xp.nextLevel))),this.classes=data.classes,this.initiative=new Skill(_.defaultValue({name:"Initiative",stats:["dexterity"],base:0},data.initiative)),this.senses=stringify(data.senses),this.aura=stringify(data.aura),this.hp=_.sprintf("%d (%s)",data.hp,data.hd),this.hpSpecial=stringify(data.hpSpecial),this.speed=stringify(data.speed),this.space=stringify(data.space),this.reach=stringify(data.reach),this.infoText=[stringify([data.templates,data.race,data.classes]," "),stringify([data.alignment,data.size,data.type]," ")],this.feats=stringify(data.feats),this.traits=stringify(data.traits),this.languages=stringify(data.languages),this.specialQualities=markdownArray(data.specialQualities),this.environment=markdownArray(data.environment),this.organization=markdownArray(data.organization),this.specialAbilities=markdownArray(data.specialAbilities),this.treasure=markdownArray(data.treasure);var abilityScores={strength:new AbilityScore({name:"Strength",base:data.abilityScores.strength}),dexterity:new AbilityScore({name:"Dexterity",base:data.abilityScores.dexterity}),constitution:new AbilityScore({name:"Constitution",base:data.abilityScores.constitution}),intelligence:new AbilityScore({name:"Intelligence",base:data.abilityScores.intelligence}),wisdom:new AbilityScore({name:"Wisdom",base:data.abilityScores.wisdom}),charisma:new AbilityScore({name:"Charisma",base:data.abilityScores.charisma})};abilityScores.getModifier=function(scoreID,factor){factor=factor||1;var modifier=this[scoreID].getModifier(factor);return 0>modifier?modifier:modifier},abilityScores.getRoll=function(scoreID){return this[scoreID].getRoll()},abilityScores.getModifiers=function(scoreIDs,factor){var modifiers=[];return _.each(scoreIDs,function(scoreID,index){this[index]=abilityScores.getModifier(scoreID,factor)},modifiers),_.reduce(modifiers,function(a,b){return a+b},0)},this.abilityScores=function(){return[abilityScores.strength,abilityScores.dexterity,abilityScores.constitution,abilityScores.intelligence,abilityScores.wisdom,abilityScores.charisma]},this.bab=new Attack({name:"Base Attack Bonus",bab:0,base:_.defaultValue(0,data.baseAttackBonus),stats:[]}),this.cmb=new Attack(data.combatManeuverBonus,{name:"Combat Maneuver Bonus",bab:this.bab.getTotal(),base:0,stats:["strength"]});var attacks=_.defaultValue({melee:[],ranged:[],special:[]},data.attacks);this.meleeAttacks=_.map(attacks.melee,function(attack){return new Attack(attack,{range:"melee",type:"weapon",bab:that.bab.getTotal(),base:0,stats:["strength"],damageStats:["strength"]})}),this.rangedAttacks=_.map(attacks.ranged,function(attack){return new Attack(attack,{range:"ranged",type:"weapon",bab:that.bab.getTotal(),base:0,stats:["dexterity"]})}),this.specialAttacks=_.map(attacks.special,function(attack){return new Attack(attack,{range:"special",type:"special",bab:that.bab.getTotal(),base:0,stats:[]})}),this.spells=_.map(data.spells,function(caster){return new Caster(caster)}),this.spellLikeAbilities=_.map(data.spellLikeAbilities,function(caster){return new SLA(caster)});var defense=data.defense||{};this.ac=new Defense(defense.ac,{name:"Armor Class",stats:["dexterity"],exemptTypes:[]}),this.cmd=new Defense(defense.cmd,{name:"Combat Maneuver Defense",stats:["strength","dexterity"],bab:this.bab.getTotal(),exemptTypes:["armor","shield","natural armor"]});var saves=_.defaultValue({fortitude:{},reflex:{},will:{},special:void 0},data.saves);this.saves={fortitude:new Save(saves.fortitude,{name:"Fortitude",stats:["constitution"],base:0}),reflex:new Save(saves.reflex,{name:"Reflex",stats:["dexterity"],base:0}),will:new Save(saves.will,{name:"Will",stats:["wisdom"],base:0}),special:stringify(data.saves.special)},this.dr=stringify(data.dr),this.immune=stringify(data.immune),this.resist=stringify(data.resist),this.sr=stringify(data.sr),this.defensive=stringify(data.defensive),this.weaknesses=stringify(data.weaknesses),_.each(data.skills,function(skill,skillIndex){this[skillIndex]=new Skill(skill)},data.skills),this.skills={},this.skills.trained=_.filter(data.skills,function(skill){return skill.isTrained()}),this.skills.untrained=_.filter(data.skills,function(skill){return!skill.isTrained()}),this.skills.get=function(skillID){var trained=_.findWhere(this.trained,{id:skillID}),untrained=_.findWhere(this.untrained,{id:skillID});return trained||untrained},this.pf={name:this.name,level:function(className,factor){return factor=factor||1,Math.floor(that.classes[className]*factor)},modifier:function(stat){return abilityScores.getModifier(stat)},spellDC:function(className,level,bonus){bonus=_.defaultValue(0,bonus);var caster=_.findWhere(that.spells,function(caster){return caster.name===className}),dc=10+level+abilityScores.getModifiers(caster.stats)+bonus;return _.sprintf("DC %d",dc)},classDC:function(className,stat,factor,min){factor=factor||.5,min=min||1;var classLevel=Math.floor(that.classes[className]*factor)||min;return _.sprintf("DC %d",10+classLevel+abilityScores.getModifier(stat))}},this.options=data.options}var isValidBonusType=function(type,exempt){var types=["alchemical","armor","circumstance","competence","deflection","dodge","enhancement","inherent","insight","luck","morale","natural armor","profane","racial","resistance","sacred","shield","size","trait","untyped"];return-1!==types.indexOf(type)&&-1===exempt.indexOf(type)},markdownArray=function(things){return _.isArray(things)||(things=[things]),_.compactMap(things,function(thing){return _.isString(thing)?thing.indexOf("@")>0?null:thing:null})},stringify=function(things,separator){function _stringify(things){var str="";return _.isNumber(things)?str=things.toString():_.isString(things)?str=things:_.isArray(things)?_.each(things,function(thing){_.isUndefined(thing)||(str+=_stringify(thing)+separator)}):_.isObject(things)&&(things.link&&things.name?str+=_.sprintf("[%s](%s)",things.name,things.link):str=_stringify(_.map(things,function(thing,thingKey){return _.sprintf("%s %s",thingKey,thing)}))),str}if(_.isUndefined(things))return void 0;separator=separator||", ";var str=_stringify(things);return", "===str.slice(-2)?str.slice(0,-2):str};_.mixin({compactMap:function(list,iteratee,context){return _.compact(_.map(list,iteratee,context))},defaultValue:function(value,param){return _.isObject(value)?_.extend(value,param):_.isUndefined(param)?value:param}}),_.mixin(_.str.exports());var app=angular.module("charactersApp",["ngRoute","ngSanitize"]);app.config(["$compileProvider","$routeProvider",function($compileProvider,$routeProvider){$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|file|blob):|data:image\//),$routeProvider.when("/",{templateUrl:"views/main.html",controller:"MainCtrl",reloadOnSearch:!1}).when("/:characterId",{templateUrl:"views/character.html",controller:"CharacterCtrl",reloadOnSearch:!1}).otherwise({redirectTo:"/",reloadOnSearch:!1})}]),app.run([function(){FastClick.attach(document.body)}]),app.controller("MainCtrl",["$http","$scope","$window",function($http,$scope,$window){$window.document.title="Character Sheets",$http.get("characters/_list.json").success(function(data){$scope.characters=data})}]),app.controller("CharacterCtrl",["$http","$routeParams","$scope","$window",function($http,$routeParams,$scope,$window){$scope.characters=[],$http.get("characters/"+$routeParams.characterId+"/_data.json").success(function(data){_.every(data,function(characterData,index){$scope.characters[index]=new Character(characterData)}),$window.document.title=$scope.characters[0].name+" - Character Sheet"})}]),marked.setOptions({renderer:new marked.Renderer,gfm:!0,tables:!0,breaks:!1,pedantic:!1,smartLists:!0,smartypants:!1}),app.directive("md",["$compile","$http","$routeParams",function($compile,$http,$routeParams){return{restrict:"E",transclude:!0,scope:{pf:"=",md:"="},templateUrl:"views/directives/md.html",link:function(scope,elem){function parse(data,isText){var markdown=data,pre=[{re:/\{\{/g,text:"`<ng-bind>"},{re:/\}\}/g,text:"</ng-bind>`"}];angular.forEach(pre,function(r){markdown=markdown.replace(r.re,r.text)});var html=marked(markdown),post=[{re:/<code>&lt;ng-bind&gt;/g,text:"{{"},{re:/&lt;\/ng-bind&gt;<\/code>/g,text:"}}"},{re:/unprepared/g,text:'<span class="unprepared">unprepared</span>'},{re:/\^([^\^]*)\^/g,text:"<sup>$1</sup>"},{re:/\$([^\$]*)\$/g,text:"<small>$1</small>"},{re:/\@([^\@]*)\@/g,text:"<roll>$1</roll>"},{re:/<a/g,text:'<a target="_blank"'},{re:/target="_blank" href="#/g,text:'href="#/'+$routeParams.characterId+"#"},{re:/:d20:/g,text:"http://www.d20pfsrd.com/"},{re:/:d20-spell:([a-z])/g,text:"http://www.d20pfsrd.com/magic/all-spells/$1/$1"},{re:/:d20-feat-([^\:]*):/g,text:"http://www.d20pfsrd.com/feats/$1-feats/"},{re:/:d20-trait-([^\:]*):/g,text:"http://www.d20pfsrd.com/traits/$1-traits/"},{re:/:d20-wop-effect:/g,text:"http://www.d20pfsrd.com/magic/variant-magic-rules/words-of-power/effect-words/"},{re:/:d20-wop-meta:/g,text:"http://www.d20pfsrd.com/magic/variant-magic-rules/words-of-power/meta-words/"},{re:/:d20-wop-target:/g,text:"http://www.d20pfsrd.com/magic/variant-magic-rules/words-of-power/target-words/"},{re:/:d20-special-abilities:/g,text:"http://www.d20pfsrd.com/gamemastering/special-abilities#TOC-"},{re:/:d20-creature-types:/g,text:"http://www.d20pfsrd.com/bestiary/rules-for-monsters/creature-types#TOC-"},{re:/:d20-universal-monster-rules:/g,text:"http://www.d20pfsrd.com/bestiary/rules-for-monsters/universal-monster-rules#TOC-"},{re:/:nethys-([^\:]*):/g,text:"http://www.archivesofnethys.com/$1Display.aspx?ItemName="},{re:/:prd-spell-crb:([a-zA-Z]+)/g,text:"http://paizo.com/pathfinderRPG/prd/spells/$1.html"},{re:/:prd-spell-apg:([a-zA-Z]+)/g,text:"http://paizo.com/pathfinderRPG/prd/advanced/spells/$1.html"},{re:/:prd-spell-uc:([a-zA-Z]+)/g,text:"http://paizo.com/pathfinderRPG/prd/ultimateCombat/spells/$1.html"},{re:/:prd-spell-um:([a-zA-Z]+)/g,text:"http://paizo.com/pathfinderRPG/prd/ultimateMagic/spells/$1.html"}];isText===!0?post=post.concat([{re:/<p/g,text:"<span"},{re:/<\/p>/g,text:"</span>"}]):html='<div class="no-break">'+html+"</div>",angular.forEach(post,function(r){html=html.replace(r.re,r.text)});var el=angular.element(html);$compile(el)(scope),elem.prepend(el)}if(void 0!==scope.md)if(scope.Math=Math,_.isNumber(scope.md)&&(scope.md=""+scope.md),_.isString(scope.md)||scope.md.toString(),-1!==scope.md.indexOf(".md")){if(-1===scope.md.indexOf("@")){var mdUrl="characters/"+$routeParams.characterId+"/"+scope.md;$http.get(mdUrl).success(parse)}}else scope.md&&parse(scope.md,!0)}}}]);