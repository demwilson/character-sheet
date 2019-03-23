#### **Lay on Hands** (Su)

A paladin can heal wounds (her own or those of others) by touch. Each day she can use this ability a number of times equal to 1/2 her paladin level plus her Charisma modifier. With one use of this ability, a paladin can heal {{Math.ceil(c.info.levels.paladin/2)}}d6 hit points of damage. Using this ability is a standard action, unless the paladin targets herself, in which case it is a swift action. Despite the name of this ability, a paladin only needs one free hand to use this ability.

Alternatively, a paladin can use this healing power to deal damage to undead creatures, dealing {{Math.ceil(c.info.levels.paladin/2)}}d6 points of damage. Using lay on hands in this way requires a successful melee touch attack and doesn't provoke an attack of opportunity. Undead do not receive a saving throw against this damage.

#### **Smite Evil** (Su)

{{Math.ceil(c.info.levels.paladin/3)}} {{ Math.ceil(c.info.levels.paladin/3) > 1 ? "times" : "time" }} per day, a paladin can call out to the powers of good to aid her in her struggle against evil. As a swift action, the paladin chooses one target within sight to smite. If this target is evil, the paladin adds her Cha bonus (if any) to her attack rolls and adds her paladin level to all damage rolls made against the target of her smite. If the target of smite evil is an outsider with the evil subtype, an evil-aligned dragon, or an undead creature, the bonus to damage on the first successful attack increases to 2 points of damage per level the paladin possesses. Regardless of the target, smite evil attacks automatically bypass any DR the creature might possess.

In addition, while smite evil is in effect, the paladin gains a +{{c.stats.scores.cha.modifier()}} deflection bonus equal to her AC against attacks made by the target of the smite. If the paladin targets a creature that is not evil, the smite is wasted with no effect.

The smite evil effect remains until the target of the smite is dead or the next time the paladin rests and regains her uses of this ability.

#### **Mercy** (Su)

The following [mercies](https://www.d20pfsrd.com/classes/core-classes/Paladin/#TOC-Mercy-Su-) apply to the paladin's Lay On Hands ability:
* Fatigued (3rd)
* Diseased (6th)
* Exhausted (9th)
* Paralyzed (12th)
* Stunned (15th)

#### **Aura of Courage** (Su)

At 3rd level, a paladin is immune to fear (magical or otherwise). Each ally within 10 feet of her gains a +4 morale bonus on saving throws against fear effects. This ability functions only while the paladin is conscious, not if she is unconscious or dead.

#### **Aura of Resolve** (Su)

At 8th level, a paladin is immune to charm spells and spell-like abilities. Each ally within 10 feet of her gains a +4 morale bonus on saving throws against charm effects. This ability functions only while the paladin is conscious, not if she is unconscious or dead.

#### **Aura of Justice** (Su)

At 11th level, a paladin can expend two uses of her smite evil ability to grant the ability to smite evil to all allies within 10 feet, using her bonuses. Allies must use this smite evil ability by the start of the paladin’s next turn and the bonuses last for 1 minute. Using this ability is a free action. Evil creatures gain no benefit from this ability.

#### **Aura of Faith** (Su)

At 14th level, a paladin’s weapons are treated as good-aligned for the purposes of overcoming Damage Reduction. Any attack made against an enemy within 10 feet of her is treated as good-aligned for the purposes of overcoming Damage Reduction. This ability functions only while the paladin is conscious, not if she is unconscious or dead.

#### **Aura of Righteousness** (Su)

At 17th level, a paladin gains DR 5/evil and immunity to compulsion spells and spell-like abilities. Each ally within 10 feet of her gains a +4 morale bonus on saving throws against compulsion effects. This ability functions only while the paladin is conscious, not if she is unconscious or dead.

