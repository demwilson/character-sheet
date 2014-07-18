"use strict";function AbilityScore(_name,_score){return this.name=_name,this.sname=_name.slice(0,3).toLowerCase(),this.score=function(){return null===_score?"–":parseInt(_score,10)||10},this.modifier=function(){return null===_score?0:Math.floor((this.score()-10)/2)},this.toString=function(){return pf.concat(this.name+" "+this.score+": ",this.total())},this.roll=function(){return pf.dice("1d20",this.modifier())},this}function Attack(_attack,_bab,scores){angular.extend(this,_attack);var stat=scores[_attack.stat||"str"];this.rolls=function(){var i,bab=_bab,arr=[],toHit=bab+stat.modifier();if(angular.isArray(_attack.bonuses))for(i=_attack.bonuses.length-1;i>=0;i--)toHit+=parseInt(_attack.bonuses[i].split(":")[1]);if(angular.isArray(_attack.iterative))for(i=0;i<_attack.iterative.length;i++)arr.push(pf.dice("1d20",toHit+_attack.iterative[i]));else arr.push(pf.dice("1d20",toHit));return arr}}function Caster(_caster,scores){angular.extend(this,_caster);var stat=scores[_caster.stat||"none"],concentrationBonus=_caster.concentrationBonus;return this.concentration=function(){return pf.dice("1d20",stat.modifier()+concentrationBonus+this.casterLevel)},this}function Defense(_ac,scores){var _stats=_ac.stats||["dex"],_bonuses=_ac.bonuses||[],_ignore={total:[],touch:[],flatfooted:[]};return angular.extend(_ignore,_ac.ignore),_ignore.touch=_ignore.touch.concat(["armor","armour","natural armor","natural armour","natural","shield"]),_ignore.flatfooted=_ignore.flatfooted.concat(["dodge","dex"]),angular.forEach(_ignore,function(type,key){type.forEach(function(e,i,a){if("-"===e.slice(0,1)){a.splice(i,1);var t=e.slice(1);_ignore[key]=a.filter(function(e){return e!==t})}})}),_stats.forEach(function(stat){stat=scores[stat||"none"],0!==stat.modifier()&&_bonuses.push(pf.concat(stat.sname,":",stat.modifier()))}),_bonuses.forEach(function(stat,index){_bonuses[index]=_bonuses[index].toLowerCase()}),this.total=function(ignore){var total=10;return ignore=ignore||[],ignore=ignore.concat(_ignore.total||[]),_bonuses.forEach(function(e){var temp=e.split(":");(-1===ignore.indexOf(temp[0].toLowerCase())||parseInt(temp[1],10)<0)&&(total+=parseInt(temp[1],10))}),total},this.touch=function(){return this.total(_ignore.touch)},this.flatfooted=function(){return this.total(_ignore.flatfooted)},this.toString=function(){return _bonuses.sort().map(function(e){var t=e.split(":");return(t[1]+" "+t[0]).toLowerCase()}).join(", ")},this}function Save(_save,scores){var stat=scores[_save.stat||"none"];return this.roll=function(){var t=_save.base+stat.modifier();if(angular.isArray(_save.bonuses))for(var i=_save.bonuses.length-1;i>=0;i--)t+=parseInt(_save.bonuses[i].split(":")[1]);return pf.dice("1d20",t)},this}function Skill(_name,_skill,scores,acp){var skills={Acrobatics:"dex",Appraise:"int",Bluff:"cha",Climb:"str",Craft:"int",Diplomacy:"cha","Disable Device":"dex",Disguise:"cha","Escape Artist":"dex",Fly:"dex","Handle Animal":"cha",Heal:"wis",Intimidate:"cha",Knowledge:"int",Linguistics:"int",Perception:"wis",Perform:"cha",Profession:"wis",Ride:"dex","Sense Motive":"wis","Sleight of Hand":"dex",Spellcraft:"int",Stealth:"dex",Survival:"wis",Swim:"str","Use Magic Device":"cha"},acpSkills={Acrobatics:!0,Climb:!0,"Disable Device":!0,"Escape Artist":!0,Fly:!0,Ride:!0,"Sleight of Hand":!0,Stealth:!0,Swim:!0},re=/\s\(|\)/;this.name=_name.split(re).length>1?_name.split(re)[1]:_name,this.baseName=_name.split(re).length>1?_name.split(re)[0]:_name;var ranks=_skill.ranks>=0?_skill.ranks:0,classSkill=_skill.classSkill&&ranks>0?3:0,stat=_skill.stat?scores[_skill.stat]:scores[skills[this.baseName]||"none"],bonuses=_skill.bonuses||[0];return this.total=function(){for(var t=void 0!==acpSkills[this.baseName]?acp:0,i=bonuses.length-1;i>=0;i--)t+="number"==typeof bonuses[i]?bonuses[i]:parseInt(bonuses[i].split(":")[1],10);return ranks+stat.modifier()+classSkill+t},this.hasRanks=function(){return ranks>0},this.toString=function(){return pf.concat(_name+": ",this.total())},this.roll=function(){return pf.dice("1d20",this.total())},this.icon=function(){var icons={Craft:"fa fa-gavel",Knowledge:"fa fa-book",Perform:"fa fa-music",Profession:"fa fa-university"};return icons[this.baseName]},this}var pf={concat:function(){for(var args=Array.prototype.slice.call(arguments),i=args.length-1;i>=0;i--)"number"==typeof args[i]&&(args[i]=args[i]<0?args[i].toString():"+"+args[i].toString());return args.join("")},dice:function(die,mod){return mod=mod||0,"1d20"===die?0>=mod?mod.toString():"+"+mod.toString():die+(0>mod?mod.toString():"+"+mod.toString())}};String.prototype.contains=function(c){return this.indexOf(c)>-1},String.prototype.lacks=function(c){return-1===this.indexOf(c)},String.prototype.capitalize=function(){return this.charAt(0).toUpperCase()+this.slice(1)},Number.prototype.toOrdinal=function(){var s=["th","st","nd","rd"],v=this%100;return this+(s[(v-20)%10]||s[v]||s[0])},String.prototype.toProperCase=function(){return this.replace(/\w\S*/g,function(txt){return txt.charAt(0).toUpperCase()+txt.substr(1).toLowerCase()})};var app=angular.module("charactersApp",["ngResource","ngRoute","ngSanitize"]);app.config(["$compileProvider","$routeProvider",function($compileProvider,$routeProvider){$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|file|blob):|data:image\//),$routeProvider.when("/",{templateUrl:"views/main.html",controller:"MainCtrl",reloadOnSearch:!1}).when("/:characterId",{templateUrl:"views/character.html",controller:"CharacterCtrl",reloadOnSearch:!1}).otherwise({redirectTo:"/",reloadOnSearch:!1})}]),app.run([function(){FastClick.attach(document.body)}]),app.filter("orderAbilityScores",function(){return function(scores){return[scores.str,scores.dex,scores.con,scores.int,scores.wis,scores.cha]}}),app.filter("filterSkills",function(){return function(skills,ranks){var output={};return angular.forEach(skills,function(skill,name){("trained"===ranks?skill.hasRanks():!skill.hasRanks())&&(output[name]=skill)}),output}}),app.filter("reverse",function(){return function(items){return items.slice().reverse()}}),app.filter("orderObjectBy",function(){return function(input,attribute){if(!angular.isObject(input))return input;var array=[];for(var objectKey in input)input.hasOwnProperty(objectKey)&&array.push(input[objectKey]);return array.sort(function(a,b){var alc=a[attribute].toLowerCase(),blc=b[attribute].toLowerCase();return alc>blc?1:blc>alc?-1:0}),array}}),app.controller("MainCtrl",["$http","$scope","$window",function($http,$scope,$window){$window.document.title="Character Sheets",$http.get("characters/_list.json").success(function(data){$scope.characters=data})}]),app.controller("CharacterCtrl",["$http","$routeParams","$scope","$window",function($http,$routeParams,$scope,$window){$scope.pf=pf,$scope.Math=Math,$http.get("characters/"+$routeParams.characterId+"/_data.json").success(function(data){$scope.characters=data,$window.document.title=$scope.characters[0].info.name+" - Character Sheet",angular.forEach($scope.characters,function(character){character.stats.scores={none:new AbilityScore("null",10),str:new AbilityScore("Strength",character.stats.scores.str),dex:new AbilityScore("Dexterity",character.stats.scores.dex),con:new AbilityScore("Constitution",character.stats.scores.con),"int":new AbilityScore("Intelligence",character.stats.scores.int),wis:new AbilityScore("Wisdom",character.stats.scores.wis),cha:new AbilityScore("Charisma",character.stats.scores.cha)};var scores=character.stats.scores;angular.forEach(character.offense.attacks,function(type,name){angular.forEach(type,function(attack,index){character.offense.attacks[name][index]=new Attack(attack,character.stats.bab,scores)})}),character.defense.ac=character.defense.ac||{},character.defense.ac=new Defense(character.defense.ac,scores),character.offense.cmb.name="combat maneuver",character.offense.cmb.hideName=!0,character.offense.cmb=new Attack(character.offense.cmb,character.stats.bab,scores),character.defense.cmd=character.defense.cmd||{};var cmd=character.defense.cmd;cmd.bonuses=cmd.bonuses||[],cmd.bab=cmd.bab||character.stats.bab,cmd.bonuses.push(pf.concat("bab:",cmd.bab)),cmd.stats=cmd.stats||[],cmd.stats.push("str"),cmd.stats.push("dex"),character.defense.cmd=new Defense(character.defense.cmd,scores,!0),character.defense.fort=new Save(character.defense.fort,scores),character.defense.refl=new Save(character.defense.refl,scores),character.defense.will=new Save(character.defense.will,scores),angular.forEach(character.skills,function(skill,name){character.skills[name]=new Skill(name,skill,scores,character.info.acp||0),"Perception"===character.skills[name].name&&(character.perception=character.skills[name])}),character.hasTrainedSkills=function(){for(var skill in character.skills)if(character.skills[skill].hasRanks())return!0},character.hasUntrainedSkills=function(){for(var skill in character.skills)if(!character.skills[skill].hasRanks())return!0},angular.forEach(character.offense.spells,function(caster,key){character.offense.spells[key]=new Caster(caster,scores)})})})}]),marked.setOptions({renderer:new marked.Renderer,gfm:!0,tables:!0,breaks:!1,pedantic:!1,smartLists:!0,smartypants:!1}),app.directive("md",["$compile","$http","$routeParams",function($compile,$http,$routeParams){return{restrict:"E",transclude:!0,scope:{md:"=",c:"="},templateUrl:"views/directives/md.html",link:function(scope,elem){function parse(data,isText){var markdown=data,pre=[{re:/\{\{/g,text:"`<ng-bind>"},{re:/\}\}/g,text:"</ng-bind>`"}];angular.forEach(pre,function(r){markdown=markdown.replace(r.re,r.text)});var html=marked(markdown),post=[{re:/<code>&lt;ng-bind&gt;/g,text:"{{"},{re:/&lt;\/ng-bind&gt;<\/code>/g,text:"}}"},{re:/unprepared/g,text:'<span class="unprepared">unprepared</span>'},{re:/\^([^\^]*)\^/g,text:"<sup>$1</sup>"},{re:/\$([^\$]*)\$/g,text:"<small>$1</small>"},{re:/\@([^\@]*)\@/g,text:"<roll>$1</roll>"},{re:/<a/g,text:'<a target="_blank"'},{re:/target="_blank" href="#/g,text:'href="#/'+$routeParams.characterId+"#"},{re:/:d20:/g,text:"http://www.d20pfsrd.com/"},{re:/:d20-spell:([a-z])/g,text:"http://www.d20pfsrd.com/magic/all-spells/$1/$1"},{re:/:d20-feat-([^\:]*):/g,text:"http://www.d20pfsrd.com/feats/$1-feats/"},{re:/:d20-trait-([^\:]*):/g,text:"http://www.d20pfsrd.com/traits/$1-traits/"},{re:/:d20-wop-effect:/g,text:"http://www.d20pfsrd.com/magic/variant-magic-rules/words-of-power/effect-words/"},{re:/:d20-wop-meta:/g,text:"http://www.d20pfsrd.com/magic/variant-magic-rules/words-of-power/meta-words/"},{re:/:d20-wop-target:/g,text:"http://www.d20pfsrd.com/magic/variant-magic-rules/words-of-power/target-words/"},{re:/:d20-special-abilities:/g,text:"http://www.d20pfsrd.com/gamemastering/special-abilities#TOC-"},{re:/:d20-creature-types:/g,text:"http://www.d20pfsrd.com/bestiary/rules-for-monsters/creature-types#TOC-"},{re:/:d20-universal-monster-rules:/g,text:"http://www.d20pfsrd.com/bestiary/rules-for-monsters/universal-monster-rules#TOC-"},{re:/:nethys-([^\:]*):/g,text:"http://www.archivesofnethys.com/$1Display.aspx?ItemName="}];isText===!0&&(post=post.concat([{re:/<p/g,text:"<span"},{re:/<\/p>/g,text:"</span>"}])),angular.forEach(post,function(r){html=html.replace(r.re,r.text)});var el=angular.element(html);$compile(el)(scope),elem.prepend(el)}if(void 0!==scope.md||void 0!==scope.md)if(scope.pf=pf,scope.Math=Math,"string"!=typeof scope.md&&(scope.md=scope.md.toString()),-1!==scope.md.indexOf(".md")){if(-1===scope.md.indexOf("@")){var mdUrl="characters/"+$routeParams.characterId+"/"+scope.md;$http.get(mdUrl).success(parse)}}else scope.md&&parse(scope.md,!0)}}}]);