"use strict";function prependToString(pre,value){return value>=0?""+pre+"+"+value:""+pre+value}function AbilityScore(name,score){return this.name=name,this.sname=name.slice(0,3),this.score=function(){return null===score?"–":parseInt(score,10)||10},this.modifier=function(){return null===score?0:Math.floor((this.score()-10)/2)},this.toString=function(){return prependToString(this.name+" "+this.score+": ",this.total())},this.roll=function(){return prependToString("1d20",this.modifier())},this}function Skill(_name,_skill,scores){var skills={Acrobatics:"dex",Appraise:"int",Bluff:"cha",Climb:"str",Craft:"int",Diplomacy:"cha","Disable Device":"dex",Disguise:"cha","Escape Artist":"dex",Fly:"dex","Handle Animal":"cha",Heal:"wis",Intimidate:"cha",Knowledge:"int",Linguistics:"int",Perception:"wis",Perform:"cha",Profession:"wis",Ride:"dex","Sense Motive":"wis","Sleight of Hand":"dex",Spellcraft:"int",Stealth:"dex",Survival:"wis",Swim:"str","Use Magic Device":"cha"},re=/\s\(|\)/;this.name=_name.split(re).length>1?_name.split(re)[1]:_name,this.baseName=_name.split(re).length>1?_name.split(re)[0]:_name;var ranks=_skill.ranks>=0?_skill.ranks:0,classSkill=_skill.classSkill&&ranks>0?3:0,stat=_skill.override?scores[_skill.override]:scores[skills[this.baseName]||"none"],bonuses=_skill.bonuses||[0];return this.total=function(){for(var t=0,i=bonuses.length-1;i>=0;i--)t+="number"==typeof bonuses[i]?bonuses[i]:parseInt(bonuses[i].split("||")[1],10);return ranks+stat.modifier()+classSkill+t},this.hasRanks=function(){return ranks>0},this.toString=function(){return prependToString(_name+": ",this.total())},this.roll=function(){return prependToString("1d20",this.total())},this.icon=function(){var icons={Craft:"fa fa-gavel",Knowledge:"fa fa-book",Perform:"fa fa-music",Profession:"fa fa-university"};return icons[this.baseName]},this}function Caster(_caster,scores){angular.extend(this,_caster);var stat=scores[_caster.stat||"none"],concentrationBonus=_caster.concentrationBonus;return this.concentration=function(){return stat.modifier()+concentrationBonus+this.casterLevel},this}function SLA(_sla,scores){angular.extend(this,_sla);var stat=scores[_sla.stat||"none"],concentrationBonus=_sla.concentrationBonus;return this.concentration=function(){return stat.modifier()+concentrationBonus+this.casterLevel},this.textFix=function(index){return this.list[index].text.split("||")},this}function AC(_ac,scores){var _stats=_ac.stats||["dex"],_bonuses=_ac.bonuses||[],_ignore={total:[],touch:[],flatfooted:[]};return angular.extend(_ignore,_ac.ignore),_ignore.touch=_ignore.touch.concat(["armor","mage armor","armour","mage armour","natural armor","natural armour","natural","shield"]),_ignore.flatfooted=_ignore.flatfooted.concat(["dodge","dex"]),angular.forEach(_ignore,function(type,key){type.forEach(function(e,i,a){if("-"===e.slice(0,1)){a.splice(i,1);var t=e.slice(1);_ignore[key]=a.filter(function(e){return e!==t})}})}),_stats.forEach(function(stat){stat=scores[stat||"none"],_bonuses.push(prependToString(stat.sname+"||",stat.modifier()))}),_bonuses.forEach(function(stat,index){_bonuses[index]=_bonuses[index].toLowerCase()}),this.total=function(ignore){var total=10;return ignore=ignore||[],ignore=ignore.concat(_ignore.total||[]),_bonuses.forEach(function(e){var temp=e.split("||");(-1===ignore.indexOf(temp[0].toLowerCase())||parseInt(temp[1],10)<0)&&(total+=parseInt(temp[1],10))}),total},this.touch=function(){return this.total(_ignore.touch)},this.flatfooted=function(){return this.total(_ignore.flatfooted)},this.toString=function(){return _bonuses.sort().map(function(e){var t=e.split("||");return(t[1]+" "+t[0]).toLowerCase()}).join(", ")},this}function Save(_save,scores){var stat=scores[_save.stat||"none"];return this.roll=function(){var t=_save.base+stat.modifier();if(angular.isArray(_save.bonuses))for(var i=_save.bonuses.length-1;i>=0;i--)t+=parseInt(_save.bonuses[i].split("||")[1]);return prependToString("1d20",t)},this}function Attack(_attack,_bab,scores){angular.extend(this,_attack);var stat=scores[_attack.stat||"none"];this.rolls=function(){var i,bab=_bab,arr=[],toHit=bab+stat.modifier();if(angular.isArray(_attack.bonuses))for(i=_attack.bonuses.length-1;i>=0;i--)toHit+=parseInt(_attack.bonuses[i].split("||")[1]);if(angular.isArray(_attack.iterative))for(i=0;i<_attack.iterative.length;i++)arr.push(prependToString("1d20",toHit+_attack.iterative[i]));else arr.push(prependToString("1d20",toHit));return arr}}function RollModalCtrl($scope,$modalInstance,name,dieSpec,result){$scope.name=name,$scope.dieSpec=dieSpec,$scope.style="panel-default",$scope.space=" ",null!==result&&($scope.res=result.res,$scope.type=result.type,20===$scope.type[0]&&2===$scope.type.length&&(20===$scope.res[0]?$scope.style="panel-success":1===$scope.res[0]&&($scope.style="panel-warning")),$scope.total=$scope.res.reduce(function(p,c){return p+c}))}function roll(dice){dice=dice.replace(/- */,"+ -"),dice=dice.replace(/D/,"d");for(var re=/ *\+ */,items=dice.split(re),res=[],type=[],i=0;i<items.length;i++){var match=items[i].match(/^[ \t]*(-)?(\d+)?(?:(d)(\d+))?[ \t]*$/);if(!match)return null;var sign=match[1]?-1:1,num=parseInt(match[2]||"1"),max=parseInt(match[4]||"0");if(match[3])for(var j=1;num>=j;j++)res[res.length]=sign*Math.ceil(max*Math.random()),type[type.length]=max;else res[res.length]=sign*num,type[type.length]=0}if(0===res.length)return null;for(i=res.indexOf(0);i>-1;i=res.indexOf(0))res.splice(i,1);return{res:res,type:type}}var FastClick=FastClick;angular.module("charactersApp",["ngSanitize","ngRoute","ngResource","ui.bootstrap"]).config(["$routeProvider",function($routeProvider){$routeProvider.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/:characterId",{templateUrl:"views/character.html",controller:"CharacterCtrl",reloadOnSearch:!1}).otherwise({redirectTo:"/"})}]).run([function(){FastClick.attach(document.body)}]),String.prototype.capitalize=function(){return this.charAt(0).toUpperCase()+this.slice(1)},Number.prototype.toOrdinal=function(){var s=["th","st","nd","rd"],v=this%100;return this+(s[(v-20)%10]||s[v]||s[0])},String.prototype.toProperCase=function(){return this.replace(/\w\S*/g,function(txt){return txt.charAt(0).toUpperCase()+txt.substr(1).toLowerCase()})},angular.module("charactersApp").controller("MainCtrl",["$scope","$http",function($scope,$http){$http.get("characters/list.json").success(function(data){$scope.characters=data})}]);var characters=[];angular.module("charactersApp").controller("CharacterCtrl",["$scope","$http","$routeParams",function($scope,$http,$routeParams){var characterUrl="characters/"+$routeParams.characterId;$scope.characterUrl=characterUrl,$scope.makeIdHref=function(idbase,c){return"#/"+$routeParams.characterId+"#"+c.info.name.toLowerCase()+idbase},$scope.prependToString=prependToString,$http.get(characterUrl+"/data.json").success(function(data){characters=data,angular.forEach(characters,function(character){character.stats.scores={none:new AbilityScore("null",10),str:new AbilityScore("Strength",character.stats.scores.str),dex:new AbilityScore("Dexterity",character.stats.scores.dex),con:new AbilityScore("Constitution",character.stats.scores.con),"int":new AbilityScore("Intelligence",character.stats.scores.int),wis:new AbilityScore("Wisdom",character.stats.scores.wis),cha:new AbilityScore("Charisma",character.stats.scores.cha)};var scores=character.stats.scores;angular.forEach(character.offense.attacks,function(type,name){angular.forEach(type,function(attack,index){character.offense.attacks[name][index]=new Attack(attack,character.stats.bab,scores)})}),character.defense.ac=character.defense.ac||{},character.defense.ac=new AC(character.defense.ac,scores),character.offense.cmb=new Attack(character.offense.cmb,character.stats.bab,scores),character.defense.cmd=character.defense.cmd||{};var cmd=character.defense.cmd;cmd.bonuses=cmd.bonuses||[],cmd.bab=cmd.bab||character.stats.bab,cmd.bonuses.push(prependToString("bab||",cmd.bab)),cmd.stats=cmd.stats||[],cmd.stats.push("str"),cmd.stats.push("dex"),character.defense.cmd=new AC(character.defense.cmd,scores,!0),character.defense.fort=new Save(character.defense.fort,scores),character.defense.refl=new Save(character.defense.refl,scores),character.defense.will=new Save(character.defense.will,scores),angular.forEach(character.skills,function(skill,name){character.skills[name]=new Skill(name,skill,scores),"Perception"===character.skills[name].name&&(character.perception=character.skills[name])}),character.hasTrainedSkills=function(){for(var skill in character.skills)if(character.skills[skill].hasRanks())return!0},character.hasUntrainedSkills=function(){for(var skill in character.skills)if(!character.skills[skill].hasRanks())return!0},angular.forEach(character.offense.spells,function(caster,key){character.offense.spells[key]=new Caster(caster,scores)}),angular.forEach(character.offense.slas,function(sla,key){character.offense.slas[key]=new SLA(sla,scores)})}),$scope.characters=characters})}]),angular.module("charactersApp").filter("orderAbilityScores",function(){return function(scores){return[scores.str,scores.dex,scores.con,scores.int,scores.wis,scores.cha]}}).filter("filterSkills",function(){return function(skills,ranks){var output={};return angular.forEach(skills,function(skill,name){("trained"===ranks?skill.hasRanks():!skill.hasRanks())&&(output[name]=skill)}),output}}).filter("reverse",function(){return function(items){return items.slice().reverse()}}).filter("orderObjectBy",function(){return function(input,attribute){if(!angular.isObject(input))return input;var array=[];for(var objectKey in input)input.hasOwnProperty(objectKey)&&array.push(input[objectKey]);return array.sort(function(a,b){var alc=a[attribute].toLowerCase(),blc=b[attribute].toLowerCase();return alc>blc?1:blc>alc?-1:0}),array}}),angular.module("charactersApp").directive("e",[function(){return{restrict:"E",transclude:!0,scope:{d:"="},templateUrl:"views/directives/e.html",link:function(scope){("string"==typeof scope.d||"number"==typeof scope.d)&&(scope.d={type:"string",text:scope.d})}}}]),angular.module("charactersApp").directive("roll",["$modal",function($modal){return{restrict:"E",scope:{name:"=",die:"="},templateUrl:"views/directives/roll.html",link:function(scope,element){scope.clean=function(){var temp=scope.die.replace("1d20","");return 0===parseInt(temp)?0:temp},element.bind("click",function(){var result=roll(scope.die);$modal.open({templateUrl:"views/directives/roll-modal.html",controller:RollModalCtrl,resolve:{name:function(){return scope.name},dieSpec:function(){return scope.die.replace("+0","","g")},result:function(){return result}}})})}}}]),angular.module("charactersApp").directive("nethys",function(){return{restrict:"E",transclude:!0,scope:{type:"@",item:"=",uri:"@"},templateUrl:"views/directives/nethys.html",link:function(scope){var temp=scope.item.split("||url:")||[];scope.uri=temp[1]||"http://www.archivesofnethys.com/"+scope.type+"Display.aspx?ItemName="+encodeURIComponent(scope.item)}}}),angular.module("charactersApp").directive("spell",function(){return{restrict:"E",scope:{name:"="},templateUrl:"views/directives/spell.html",link:function(scope){var temp=scope.name.split("||");scope.spellName=temp[0].toLowerCase(),"unprepared"===scope.spellName&&(scope.unprepared=!0),scope.url=temp[0];for(var i=temp.length-1;i>=0;i--){var split=temp[i].split(":");switch(split[0]){case"dc":scope.dc=split[1];break;case"type":scope.sup=split[1];break;case"meta":scope.meta=split[1];break;case"cast":scope.cast="cast";break;case"count":scope.count=parseInt(split[1],10);break;case"url":scope.url=split[1]}}scope.countDC=function(){return scope.count&&scope.dc?scope.count+", DC "+scope.dc:scope.count?scope.count:scope.dc?"DC "+scope.dc:void 0}}}}),angular.module("charactersApp").directive("attack",[function(){return{restrict:"E",scope:{data:"="},templateUrl:"views/directives/attack.html",link:function(scope){scope.name=scope.data.name,scope.dice=scope.data.rolls()}}}]),angular.module("charactersApp").directive("feat",function(){return{restrict:"E",scope:{name:"="},templateUrl:"views/directives/feat.html",link:function(scope){var temp=scope.name.split("||");scope.name=temp[0],scope.uri="http://www.archivesofnethys.com/FeatDisplay.aspx?ItemName=",scope.uri=temp[1]||scope.uri+encodeURIComponent(scope.name.split(" (")[0])}}});var marked=marked;marked.setOptions({renderer:new marked.Renderer,gfm:!0,tables:!0,breaks:!1,pedantic:!1,smartLists:!0,smartypants:!1}),angular.module("charactersApp").directive("md",["$http","$routeParams","$compile",function($http,$routeParams,$compile){return{restrict:"E",transclude:!0,scope:{md:"=",c:"="},templateUrl:"views/directives/md.html",link:function(scope,elem){scope.Math=Math;var url="characters/"+$routeParams.characterId+"/"+scope.md+".md";-1===scope.md.indexOf("@")&&$http.get(url).success(function(data){var html=marked(data),replaceList=[{re:/\^([^\^]*)\^/g,text:"<sup>$1</sup>"},{re:/\$([^\$]*)\$/g,text:"<small>$1</small>"},{re:/:d20spell:([a-z])/g,text:"http://www.d20pfsrd.com/magic/all-spells/$1/$1"},{re:/:d20wop-effect:/g,text:"http://www.d20pfsrd.com/magic/variant-magic-rules/words-of-power/effect-words/"},{re:/:d20wop-meta:/g,text:"http://www.d20pfsrd.com/magic/variant-magic-rules/words-of-power/meta-words/"},{re:/:d20wop-target:/g,text:"http://www.d20pfsrd.com/magic/variant-magic-rules/words-of-power/target-words/"},{re:/<a/g,text:'<a target="_blank"'}];angular.forEach(replaceList,function(re){html=html.replace(re.re,re.text)});var el=angular.element(html);$compile(el)(scope),elem.append(el)})}}}]);