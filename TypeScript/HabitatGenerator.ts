/************************************************************************************\

	Habitat Generator written by Nathaniel Inman on 07/02/2014
     
	Habitat Type list was created in XML on 03/29/13. 
	The XML was migrated to JSON on 07/02/2014
	
	The list was extended for implementation in Exploring The Bleak
	on 03/30/13. The list is used in Plains of Sedia : Origins, Developed by
	Nathaniel Inman of The Other Experiment Studio found @ www.theoestudio.com
	All contents within are licensed under GPLv3

|************************************************************************************|
	L E V E L    R E Q U I R E M E N T S
|************************************************************************************|	
 
	Levels are between 0 and 20. There should be a greater number of habitats
	tailored around the end game. Minimum levels should be accomodated around
	the standard levels 0-20, but maximum levels can stray above 20 to give
	the player a greater sense of danger and difficulty on end-game levels.
	Please keep in mind that bosses will also carry this theme, and a level 30
	Wyvern would be nearly impossible to defeat no matter how equipped a level
	20 player might be as the dodge chance of the level difference to create
	tremendous difficulties, not to mention the crit chance of the Wyvern
	possibly killing the player in one hit.

|************************************************************************************|
	P O P U L A T I O N
|************************************************************************************|
	
	There are 5 population degrees~1:Vacant,2:Sparse,3:Even,4:Dense,5:Full
	Vacant is completely empty and packed is completely full, and the other
	options are the most common. 1 and 5 are used predominately for
	debugging purposes.

|************************************************************************************|
	E N V I R O N M E N T S
|************************************************************************************|
	
	Environments are a pivitol part of all of PLOS, including ETB. It's
	important that habitats try not to be locked into specific environment
	types so that there can be more replayability in the game. Not to mention,
	environments chance the standard creatures that will spawn next to the
	magical creatures. This ensures that the area will have a great chance
	of being significantly different each time it's played.

|************************************************************************************|
	S P A W N S
|************************************************************************************|
	:: Type ::
	There are 3 different types: Magical Creatures, Standard Creatures, and
	Races. Each points to a different list. Note that there should not be
	an over abundance of a certain type in a habitat, especially magical
	creatures, as they're supposed to be uncommon within the world. (not
	necessarily rare.)
	
	:: Chance ::
	There is a 1-100% chance for the spawn to occur, the number of times that
	the mobile occurs depends both on the rank type (if it's>1) the size of
	the map, and the population tag of the habitat.
	
	:: Archetypes ::
	0:Standard,1:Zombie,2:Skeletal,3:Spirit,4:Phantom,5:Wraith,6:Spectral,
	7:Horror,8:Archon,9:Bugbear,10:Apparition
	Archetypes distinguish the creatures:
	existence status - Living,Dead,Undead,Incorporeal
	Whether they can be animated - 0,1
	Whether they can be enslaved - 0,1
	What their amplitude of physical damage is (-100% to 100%)
	What their resistance of physical damage is (-100% to 100%)
	What their elemental resistances are for Fire,Water,Air,Spirit & Earth
	What their elemental amplitudes are for Fire,Water,Air,Spirit & Earth
	What their sub-elemental resistances are for Han,Cho,Omn,Nu & Khai
	What their sub-elemental amplitudes are for Han,Cho,Omn,Nu & Khai
	
	:: Rank Types ::
	0:Regular,1:Minion,2:Mini-Boss,3:Boss,4:Rare,5:Ultra Rare,6:Epic
	All types spawn with a chance of 1-100%; though, Ranks above 1 will
	spawn a max of one time per habitat. Ranks above 0 will gradually
	have increased loot chance, health, armor, and damage to not exceed
	an additional 25% to each category. For detailed information on
	ranks refer to "Mobiles/Ranks.xml"
	
	:: Value ::
	The value within the mob tag specifies the specific entry of the specified 
	type tag list, whether that be magical creatures, standard creatures,
	or races.
	
|************************************************************************************|
	L O O T
|************************************************************************************|

	the chance (/100%) that a random item will drop is given by the type
	"?" under the loot section. Specific types may be dictated, where
	the available types are: armor, weapon, and ?. Potions and other
	miscellaneous item types are not allowed in habitats for balancing
	issues. Specific item types may be specified between the item brackets
	to indicate that a specific item may drop. Note that if a specific
	item is indicated, it will drop a maximum of one type per that habitat.
	It is generally assumed that a habitat will only be visited one time
	per player, so specifying certain items is okay, but tends to make
	the game predictable; thereby, please reduce the chance of those items
	to drop so they're merely slightly higher than the standard drop
	chance.

\************************************************************************************/

/* Ambient variables at window scope */
declare var ctx:any;
declare var v:any;

/* Each entry is serializable */
interface Serializable<T>{
	deserialize(input: Object): T;
}

/* Identifies the entries */
class Entry implements Serializable<Entry> {
		name: String;
		type: Object;
		description: String;
	deserialize(input){
		this.name = input.name;
		this.type={
			pet:input.type.pet,
			mount:input.type.mount,
			description:input.type.description
		}
		this.description = input.description;
		return this;
	}
}

/* The main class */
class CreatureGenerator implements Serializable<CreatureGenerator>{
	member: number;
	creature: any;
	constructor(list){
		this.creature=[];
		this.deserialize(list);
		easel.redraw=()=>this.draw();
	}
	deserialize(list){
		for(creature in list){
			this.creature.push(new Entry().deserialize(list[creature]));
		}
		this.update();
	}
	draw(){
		ctx.font='24px Courier New';
		ctx.textAlign='center';
		ctx.fillStyle='#000';
		ctx.fillRect(0,0,v.w,v.h);
		ctx.fillStyle='#333';
		ctx.fillRect(0,0,v.w,48);
		ctx.fillStyle='#08F';
		ctx.fillRect(0,48,v.w,2);
		ctx.fillStyle='#112';
		ctx.fillRect(0,v.h/8+v.h/10,v.w,v.h/10);
		ctx.fillRect(0,v.h/8+v.h/10*3,v.w,v.h/10);
		ctx.fillRect(0,v.h/8+v.h/10*5,v.w,v.h/10);
		ctx.fillRect(0,v.h/8+v.h/10*7,v.w,v.h/10);
		ctx.fillStyle='#04A';
		ctx.fillRect(0,v.h/8+v.h/10,v.w,2);
		ctx.fillRect(0,v.h/8+v.h/10*2,v.w,2);
		ctx.fillRect(0,v.h/8+v.h/10*3,v.w,2);
		ctx.fillRect(0,v.h/8+v.h/10*4,v.w,2);
		ctx.fillRect(0,v.h/8+v.h/10*5,v.w,2);
		ctx.fillRect(0,v.h/8+v.h/10*6,v.w,2);
		ctx.fillRect(0,v.h/8+v.h/10*7,v.w,2);
		ctx.fillRect(0,v.h/8+v.h/10*8,v.w,2);
		ctx.fillStyle='#FFF';
		ctx.fillText(this.creature[this.member].name,v.w/2,30);
		ctx.fillText(this.creature[this.member].type.pet?'This creature is a pet.':'This creature is NOT a pet.',v.w/2,v.h/8+v.h/10+v.h/20+6);
		ctx.fillText(this.creature[this.member].type.mount?'This creature is a mount.':'This creature is NOT a mount.',v.w/2,v.h/8+v.h/10*3+v.h/20+6);
		ctx.fillText(this.creature[this.member].type.description,v.w/2,v.h/8+v.h/10*5+v.h/20+6);
		ctx.fillText(this.creature[this.member].description,v.w/2,v.h/8+v.h/10*7+v.h/20+6);
	}
	update(){
		this.member=r(0,this.creature.length,false);
		this.draw();
		setTimeout(() => this.update(),1000);
	}
}

/* Initialization */
var data = [
	{
		name:"Westphalian",
		type:{
			pet:0,
			mount:1,
			description:"forest animal",
		},
	},{
		name:"Hanoverian",
		type:{
			pet:0,
			mount:1,
			description:"forest animal",
		},
	},{
		name:"Aegidienberger",
		type:{
			pet:0,
			mount:1,
			description:"forest animal",
		},
	},{
		name:"Andalusian",
		type:{
			pet:0,
			mount:1,
			description:"forest animal",
		},
	},{
		name:"Percheron",
		type:{
			pet:0,
			mount:1,
			description:"forest animal",
		},
	},{
		name:"Trakehner",
		type:{
			pet:0,
			mount:1,
			description:"forest animal",
		},
	},{
		name:"Zemaitukas",
		type:{
			pet:0,
			mount:1,
			description:"forest animal, desert animal",
		},
	},{
		name:"Pottok",
		type:{
			pet:0,
			mount:1,
			description:"forest animal, desert animal",
		},
	},{
		name:"Eriskay",
		type:{
			pet:0,
			mount:1,
			description:"forest animal, desert animal",
		},
	},{
		name:"Paso Fino",
		type:{
			pet:0,
			mount:1,
			description:"forest animal",
		},
	},{
		name:"Freiberger",
		type:{
			pet:0,
			mount:1,
			description:"forest animal",
		},
	},{
		name:"Lusitano",
		type:{
			pet:0,
			mount:1,
			description:"forest animal",
		},
	},{
		name:"Murgese",
		type:{
			pet:0,
			mount:1,
			description:"forest animal",
		},
	},{
		name:"Oldenburg",
		type:{
			pet:0,
			mount:1,
			description:"forest animal",
		},
	},{
		name:"Dulmen",
		type:{
			pet:0,
			mount:1,
			description:"forest animal",
		},
	},{
		name:"Connemara",
		type:{
			pet:0,
			mount:1,
			description:"forest animal",
		},
	},{
		name:"Chincoteague",
		type:{
			pet:0,
			mount:1,
			description:"forest animal, desert animal",
		},
	},{
		name:"Cypriot",
		type:{
			pet:0,
			mount:1,
			description:"forest animal, desert animal",
		},
	},{
		name:"Mule",
		type:{
			pet:0,
			mount:1,
			description:"forest animal",
		},
	},{
		name:"Kiang",
		type:{
			pet:0,
			mount:1,
			description:"forest animal, desert animal",
		},
	},{
		name:"Standardbred",
		type:{
			pet:0,
			mount:1,
			description:"forest animal",
		},
	},{
		name:"Thoroughbred",
		type:{
			pet:0,
			mount:1,
			description:"forest animal",
		},
	},{
		name:"Azteca",
		type:{
			pet:0,
			mount:1,
			description:"forest animal",
		},
	},{
		name:"Appaloosa",
		type:{
			pet:0,
			mount:1,
			description:"forest animal",
		},
	},{
		name:"Dartmoor",
		type:{
			pet:0,
			mount:1,
			description:"forest animal, desert animal",
		},
	},{
		name:"Ladruber",
		type:{
			pet:0,
			mount:1,
			description:"forest animal",
		},
	},{
		name:"Knabstrup",
		type:{
			pet:0,
			mount:1,
			description:"forest animal",
		},
	},{
		name:"Karabakh",
		type:{
			pet:0,
			mount:1,
			description:"forest animal",
		},
	},{
		name:"Ardennes",
		type:{
			pet:0,
			mount:1,
			description:"forest animal",
		},
	},{
		name:"Belgian",
		type:{
			pet:0,
			mount:1,
			description:"forest animal",
		},
	},{
		name:"Clydesdale",
		type:{
			pet:0,
			mount:1,
			description:"forest animal",
		},
	},{
		name:"Fell",
		type:{
			pet:0,
			mount:1,
			description:"forest animal, desert animal",
		},
	},{
		name:"Faroe",
		type:{
			pet:0,
			mount:1,
			description:"forest animal, desert animal",
		},
	},{
		name:"Poitou",
		type:{
			pet:0,
			mount:1,
			description:"forest animal, desert animal",
		},
	},{
		name:"Akita Inu",
		type:{
			pet:0,
			mount:0,
			description:"forest animal,mountain animal",
		},
	},{
		name:"Bulldog",
		type:{
			pet:0,
			mount:0,
			description:"forest animal, mountain animal",
		},
	},{
		name:"Pitbull Terrier",
		type:{
			pet:0,
			mount:0,
			description:"forest animal, mountain animal",
		},
	},{
		name:"Staffordshire Terrier",
		type:{
			pet:0,
			mount:0,
			description:"forest animal, mountain animal",
		},
	},{
		name:"Argentine Dogo",
		type:{
			pet:0,
			mount:0,
			description:"forest animal, mountain animal",
		},
	},{
		name:"Boston Terrier",
		type:{
			pet:0,
			mount:0,
			description:"forest animal, mountain animal",
		},
	},{
		name:"Bull Terrier",
		type:{
			pet:0,
			mount:0,
			description:"forest animal, mountain animal",
		},
	},{
		name:"Dogue de Bordeaux",
		type:{
			pet:0,
			mount:0,
			description:"forest animal, mountain animal",
		},
	},{
		name:"English Mastiff",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Neopolitan Mastiff",
		type:{
			pet:0,
			mount:0,
			description:"forest animal, mountain animal",
		},
	},{
		name:"Manchester Terrier",
		type:{
			pet:0,
			mount:0,
			description:"forest animal, mountain animal",
		},
	},{
		name:"Shar Pei",
		type:{
			pet:0,
			mount:0,
			description:"forest animal, mountain animal",
		},
	},{
		name:"Tosa",
		type:{
			pet:0,
			mount:0,
			description:"forest animal, mountain animal",
		},
	},{
		name:"Leopard",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Snow Leopard",
		type:{
			pet:0,
			mount:0,
			description:"forest animal, mountain animal",
		},
	},{
		name:"Clouded Leopard",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Cheetah",
		type:{
			pet:0,
			mount:0,
			description:"forest animal, jungle animal",
		},
	},{
		name:"Bengal Tiger",
		type:{
			pet:0,
			mount:0,
			description:"forest animal, jungle animal",
		},
	},{
		name:"Balinese Tiger",
		type:{
			pet:0,
			mount:0,
			description:"forest animal, jungle animal",
		},
	},{
		name:"Sumatran Tiger",
		type:{
			pet:0,
			mount:0,
			description:"forest animal, jungle animal",
		},
	},{
		name:"Siberian Tiger",
		type:{
			pet:0,
			mount:0,
			description:"forest animal, jungle animal",
		},
	},{
		name:"Amur Tiger",
		type:{
			pet:0,
			mount:0,
			description:"forest animal,jungle animal",
		},
	},{
		name:"Jaguar",
		type:{
			pet:0,
			mount:0,
			description:"forest animal, jungle animal",
		},
	},{
		name:"Lion",
		type:{
			pet:0,
			mount:0,
			description:"jungle animal, desert animal",
		},
	},{
		name:"Orangutan",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Cape Buffalo",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Rainbow Lizard",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Flying Squirrel",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Giant Panda",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Fox",
		type:{
			pet:0,
			mount:0,
			description:"forest animal, jungle animal",
		},
	},{
		name:"Bongo",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Bontebok",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Fossa",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Forest Hog",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Gerbil",
		type:{
			pet:0,
			mount:0,
			description:"forest animal, desert animal",
		},
	},{
		name:"Hare",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Hedgehog",
		type:{
			pet:0,
			mount:0,
			description:"forest animal, desert animal, jungle animal",
		},
	},{
		name:"Jackal",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Mandrill",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Nyala",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Oribi",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Otter",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Mongoose",
		type:{
			pet:0,
			mount:0,
			description:"forest animal, jungle animal",
		},
	},{
		name:"Seal",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Reedbuck",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Warthog",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Waterbuck",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Wild Cat",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Badger",
		type:{
			pet:0,
			mount:0,
			description:"",
		},
	},{
		name:"Gorilla",
		type:{
			pet:0,
			mount:0,
			description:"forest animal, jungle animal, mountain animal",
		},
	},{
		name:"Dwarf Mongoose",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Lemur",
		type:{
			pet:0,
			mount:0,
			description:"jungle animal",
		},
	},{
		name:"Iguana",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Golden Toad",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Giant Armadillo",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Sloth",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Squirrel Monkey",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Pygmy Marmoset",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Elephant",
		type:{
			pet:0,
			mount:0,
			description:"",
		},
	},{
		name:"Aye-Aye Monkey",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Capuchin Monkey",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Poison Arrow Frog",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Alpaca Anteater",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Red Deer Giant Armadillo",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Wooly Monkey",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Spider Monkey",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Porcupine",
		type:{
			pet:0,
			mount:0,
			description:"forest animal, desert animal",
		},
	},{
		name:"White Faced Monkey",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Howler Monkey",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Capybara",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Okapi",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Sumatran Rhinoceros",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Silvery Gibbon",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Giant River Otter",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Toucan Poison Arrow Frog",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Happface Spider",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Glass Frog",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Leaf-Cutter Ant",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Bush Pig",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Strawberry Poisoned Dart Frog",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Antelope",
		type:{
			pet:0,
			mount:0,
			description:"forest animal,jungle animal",
		},
	},{
		name:"Bactrian Camel",
		type:{
			pet:0,
			mount:1,
			description:"forest animal",
		},
	},{
		name:"Bahamas Rock Iguana",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Bale Monkey",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Owl Faced Monkey",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Ostrich",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Ouachita Burrowing Crayfish",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Geometric Tortoise",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Galapagos Land Snail",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Salta Water Toad",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Saltwater Crocodile",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Samoan Tree Snail",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Samoan Flying Fox",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Sambar Deer",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Salvin's Salamander",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Fairy Shrimp",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Uzungwe Toad",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Prairie Dog",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Usambara Banana Frog",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Zug's Robber Frog",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Zhou's Box Turtle",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Zapahuira Water Frog",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Zambian Mole Rat",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Zacate Blanco Treefrog",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Yunnan Flying Frog",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Yiwu Salamander",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Yellowtail Flounder",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Yellow-tailed Wooly Monkey",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Yellow-spotted Salamander",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Yellow-margined Box Turtle",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Yellow-legged Climbing Salamander",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"White-lipped Deer",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Yellow River Frog",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Yarey Robber Frog",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Warty Tree Toad",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Visayan Deer",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Volcan Tacana Toad",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Yamur Lake Grunter",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Yalobusha Riverlet Crayfish",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Western Bearded Pig",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Yap Flying Fox",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Wyoming Toad",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Volcano Rabbit",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Wrinkled Madagascar Frog",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Wutai Crab",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Wreathed Cactus Snail",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Wood Turtle",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Wolverine",
		type:{
			pet:0,
			mount:0,
			description:"forest animal, jungle animal",
		},
	},{
		name:"Wondiwoi Tree Kangaroo",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Wild Goat",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Whitehead's Spiny Rat",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"White-tipped Tuft-tailed Rat",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"White-tailed Mouse",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"White-cheeked Spider Monkey",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Water Frog Wang's Crab",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Wild Yak White-tailed Deer",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"White-spotted Madagascar Frog",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Visayan Warty Pig",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Crocodile Newt",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Vanikoro Flying Fox",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Unicolored Oldfield Mouse",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Ubatuba Dwarf Frog",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Turkana Mud Turtle",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Tufted Deer",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Tulotoma Snail",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Tumbala Climbing Rat",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Tufted Gray Langur",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Tufted Ground Squirrel",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Tree Hole Crab",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Travancore Flying Squirrel",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Toothless Blindcat Timor",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Tiger Chameleon",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Telescope Hornsnail",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Three-striped Roof Turtle",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Langur",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Pebblesnail",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Jackrabbit",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Swamp Deer",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Painted Tree Rat",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Palau Flying Fox",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Pond Turtle",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"La Palma Giant Lizard",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Kinabalu Toad",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Juliana's Golden Mole",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Jagged-shelled Turtle",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Ivory Coast Frog",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Indian Giant Squirrel",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Sulcata Tortoise",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Dhole",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Gazelle",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Florida Panther",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Gray Wolf",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Grizzly Bear",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Koala Bears",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Kinkajou",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Kangaroo Rat",
		type:{
			pet:0,
			mount:0,
			description:"forest animal, desert animal",
		},
	},{
		name:"Numbat",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Red Wolf",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Tasmanian Devil",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"White Rhinoceros",
		type:{
			pet:0,
			mount:0,
			description:"forest animal",
		},
	},{
		name:"Wallaby",
		type:{
			pet:0,
			mount:0,
			description:"forest animal, desert animal",
		},
	},{
		name:"Prairie Falcon",
		type:{
			pet:0,
			mount:0,
			description:"forest bird, mountain bird",
		},
	},{
		name:"Cooper's Hawk",
		type:{
			pet:0,
			mount:0,
			description:"forest bird, mountain bird",
		},
	},{
		name:"Chanting Goshawk",
		type:{
			pet:0,
			mount:0,
			description:"forest bird, jungle bird, mountain bird",
		},
	},{
		name:"Peregrine Falcon",
		type:{
			pet:0,
			mount:0,
			description:"forest bird, desert bird, mountain bird",
		},
	},{
		name:"Osprey",
		type:{
			pet:0,
			mount:0,
			description:"forest bird, jungle bird, mountain bird",
		},
	},{
		name:"Harpy Eagle",
		type:{
			pet:0,
			mount:0,
			description:"forest bird, mountain bird",
		},
	},{
		name:"Golden Eagle",
		type:{
			pet:0,
			mount:0,
			description:"forest bird, mountain bird",
		},
	},{
		name:"Lammergeier",
		type:{
			pet:0,
			mount:0,
			description:"forest bird",
		},
	},{
		name:"Pariah Kite",
		type:{
			pet:0,
			mount:0,
			description:"forest bird, jungle bird, mountain bird",
		},
	},{
		name:"Brehminy Kite",
		type:{
			pet:0,
			mount:0,
			description:"forest bird, mountain bird",
		},
	},{
		name:"Burrowing Owl",
		type:{
			pet:0,
			mount:0,
			description:"forest bird, mountain bird",
		},
	},{
		name:"White Pelican",
		type:{
			pet:0,
			mount:0,
			description:"forest bird",
		},
	},{
		name:"Great Blue Heron",
		type:{
			pet:0,
			mount:0,
			description:"forest bird",
		},
	},{
		name:"Snowy Egret",
		type:{
			pet:0,
			mount:0,
			description:"forest bird",
		},
	},{
		name:"Green Heron",
		type:{
			pet:0,
			mount:0,
			description:"forest bird",
		},
	},{
		name:"Greater White-fronted Goose",
		type:{
			pet:0,
			mount:0,
			description:"forest bird",
		},
	},{
		name:"Purple Martin",
		type:{
			pet:0,
			mount:0,
			description:"forest bird",
		},
	},{
		name:"Wood Duck",
		type:{
			pet:0,
			mount:0,
			description:"forest bird",
		},
	},{
		name:"Red-shouldered Hawk",
		type:{
			pet:0,
			mount:0,
			description:"forest bird",
		},
	},{
		name:"Mountain Bluebird",
		type:{
			pet:0,
			mount:0,
			description:"forest bird",
		},
	},{
		name:"Ruby-crowned Kinglet",
		type:{
			pet:0,
			mount:0,
			description:"forest bird",
		},
	},{
		name:"Black-headed Heron",
		type:{
			pet:0,
			mount:0,
			description:"forest bird",
		},
	},{
		name:"Hooded Vulture",
		type:{
			pet:0,
			mount:0,
			description:"forest bird",
		},
	},{
		name:"Swallow-tailed Kite",
		type:{
			pet:0,
			mount:0,
			description:"forest bird",
		},
	},{
		name:"Paradise Tanager",
		type:{
			pet:0,
			mount:0,
			description:"forest bird",
		},
	},{
		name:"Long-tailed Sylph",
		type:{
			pet:0,
			mount:0,
			description:"forest bird",
		},
	},{
		name:"Black-backed Grosbeak",
		type:{
			pet:0,
			mount:0,
			description:"forest bird",
		},
	},{
		name:"Great Horned Owl",
		type:{
			pet:0,
			mount:0,
			description:"forest bird",
		},
	},{
		name:"Hoopoe Malachite",
		type:{
			pet:0,
			mount:0,
			description:"forest bird",
		},
	},{
		name:"Sunbird",
		type:{
			pet:0,
			mount:0,
			description:"forest bird",
		},
	},{
		name:"Scarlet Macaw",
		type:{
			pet:0,
			mount:0,
			description:"forest bird",
		},
	},{
		name:"Orange Winged Parrot",
		type:{
			pet:0,
			mount:0,
			description:"forest bird",
		},
	},{
		name:"Woodpecker",
		type:{
			pet:0,
			mount:0,
			description:"forest bird",
		},
	},{
		name:"Belted Kingfisher",
		type:{
			pet:0,
			mount:0,
			description:"forest bird",
		},
	},{
		name:"Hooded Oriole",
		type:{
			pet:0,
			mount:0,
			description:"forest bird",
		},
	},{
		name:"Western Meadowlark",
		type:{
			pet:0,
			mount:0,
			description:"forest bird",
		},
	},{
		name:"Hummingbird",
		type:{
			pet:0,
			mount:0,
			description:"forest bird",
		},
	},{
		name:"White-Throate Swift",
		type:{
			pet:0,
			mount:0,
			description:"forest bird",
		},
	},{
		name:"Northern Pygmy Owl",
		type:{
			pet:0,
			mount:0,
			description:"forest bird",
		},
	},{
		name:"Yellow Billed Cuckoo",
		type:{
			pet:0,
			mount:0,
			description:"forest bird",
		},
	},{
		name:"Sandpiper",
		type:{
			pet:0,
			mount:0,
			description:"forest bird",
		},
	},{
		name:"Mockingbird",
		type:{
			pet:0,
			mount:0,
			description:"forest bird",
		},
	},{
		name:"Zamboanga Bulbul",
		type:{
			pet:0,
			mount:0,
			description:"forest bird",
		},
	},{
		name:"Wilson's Bird-of-paradise",
		type:{
			pet:0,
			mount:0,
			description:"forest bird",
		},
	},{
		name:"Yemen Thrush",
		type:{
			pet:0,
			mount:0,
			description:"forest bird",
		},
	},{
		name:"Wrinkled Hornbill",
		type:{
			pet:0,
			mount:0,
			description:"forest bird",
		},
	},{
		name:"Yellowish Imperial Pigeon",
		type:{
			pet:0,
			mount:0,
			description:"forest bird",
		},
	},{
		name:"Northern Spotted Owl",
		type:{
			pet:0,
			mount:0,
			description:"forest bird",
		},
	},{
		name:"Yellow-throated Hanging-parrot",
		type:{
			pet:0,
			mount:0,
			description:"forest bird",
		},
	},{
		name:"Wood Stork",
		type:{
			pet:0,
			mount:0,
			description:"forest bird",
		},
	},{
		name:"Yellow-shouldered Blackbird",
		type:{
			pet:0,
			mount:0,
			description:"forest bird",
		},
	},{
		name:"prairie Chicken",
		type:{
			pet:0,
			mount:0,
			description:"forest bird",
		},
	},{
		name:"Lilian's Lovebird",
		type:{
			pet:0,
			mount:0,
			description:"forest bird",
		},
	},{
		name:"Yellow-legged Pigeon",
		type:{
			pet:0,
			mount:0,
			description:"forest bird",
		},
	},{
		name:"White-winged Collared Dove",
		type:{
			pet:0,
			mount:0,
			description:"forest bird",
		},
	},{
		name:"Yellow-eyed Starling",
		type:{
			pet:0,
			mount:0,
			description:"forest bird",
		},
	},{
		name:"Western Spotted Owl",
		type:{
			pet:0,
			mount:0,
			description:"forest bird",
		},
	},{
		name:"Marbeled Murrelet",
		type:{
			pet:0,
			mount:0,
			description:"forest bird",
		},
	},{
		name:"Yellow-crowned Parakeet",
		type:{
			pet:0,
			mount:0,
			description:"forest bird",
		},
	},{
		name:"Kekapo",
		type:{
			pet:0,
			mount:0,
			description:"forest bird",
		},
	},{
		name:"Yellow-crested Cockatoo",
		type:{
			pet:0,
			mount:0,
			description:"forest bird",
		},
	},{
		name:"Hawaiian Goose",
		type:{
			pet:0,
			mount:0,
			description:"forest bird",
		},
	},{
		name:"White-winged Wood Duck",
		type:{
			pet:0,
			mount:0,
			description:"forest bird",
		},
	},{
		name:"Purple Eagle",
		type:{
			pet:0,
			mount:0,
			description:"forest bird",
		},
	},{
		name:"Brown-winged Kingfisher",
		type:{
			pet:0,
			mount:0,
			description:"forest bird",
		},
	},{
		name:"Bukhts",
		type:{
			pet:0,
			mount:0,
			description:"desert animal",
		},
	},{
		name:"Mule",
		type:{
			pet:0,
			mount:0,
			description:"desert animal",
		},
	},{
		name:"Dulmen",
		type:{
			pet:0,
			mount:0,
			description:"desert animal",
		},
	},{
		name:"Connemara",
		type:{
			pet:0,
			mount:0,
			description:"desert animal",
		},
	},{
		name:"Giehe",
		type:{
			pet:0,
			mount:1,
			description:"desert animal",
		},
	},{
		name:"Trokk",
		type:{
			pet:0,
			mount:1,
			description:"desert animal",
		},
	},{
		name:"Derva",
		type:{
			pet:0,
			mount:1,
			description:"desert animal",
		},
	},{
		name:"Ocelot",
		type:{
			pet:0,
			mount:0,
			description:"desert animal",
		},
	},{
		name:"Lion",
		type:{
			pet:0,
			mount:0,
			description:"desert animal",
		},
	},{
		name:"Addax Antelope",
		type:{
			pet:0,
			mount:0,
			description:"desert animal",
		},
	},{
		name:"Arabian Horse",
		type:{
			pet:0,
			mount:0,
			description:"desert animal",
		},
	},{
		name:"Bat",
		type:{
			pet:0,
			mount:0,
			description:"desert animal",
		},
	},{
		name:"Bighorn Sheep",
		type:{
			pet:0,
			mount:0,
			description:"desert animal, mountain animal",
		},
	},{
		name:"Bilby",
		type:{
			pet:0,
			mount:0,
			description:"desert animal",
		},
	},{
		name:"Cape Hare",
		type:{
			pet:0,
			mount:0,
			description:"desert animal",
		},
	},{
		name:"Chuckwallas",
		type:{
			pet:0,
			mount:0,
			description:"desert animal",
		},
	},{
		name:"Civet",
		type:{
			pet:0,
			mount:0,
			description:"desert animal",
		},
	},{
		name:"Collared Peccary",
		type:{
			pet:0,
			mount:0,
			description:"desert animal",
		},
	},{
		name:"Desert Elephant",
		type:{
			pet:0,
			mount:0,
			description:"desert animal",
		},
	},{
		name:"Desert Iguana",
		type:{
			pet:0,
			mount:0,
			description:"desert animal",
		},
	},{
		name:"Desert Tortoise",
		type:{
			pet:0,
			mount:0,
			description:"desert animal",
		},
	},{
		name:"Dingo",
		type:{
			pet:0,
			mount:0,
			description:"desert animal",
		},
	},{
		name:"Donkey",
		type:{
			pet:0,
			mount:0,
			description:"desert animal",
		},
	},{
		name:"Dromedary",
		type:{
			pet:0,
			mount:0,
			description:"desert animal",
		},
	},{
		name:"Fennec Fox",
		type:{
			pet:0,
			mount:0,
			description:"desert animal",
		},
	},{
		name:"Flamingo",
		type:{
			pet:0,
			mount:0,
			description:"desert animal",
		},
	},{
		name:"Gila Monster",
		type:{
			pet:0,
			mount:0,
			description:"desert animal",
		},
	},{
		name:"Hyena",
		type:{
			pet:0,
			mount:0,
			description:"desert animal",
		},
	},{
		name:"Jerboa",
		type:{
			pet:0,
			mount:0,
			description:"desert animal",
		},
	},{
		name:"Lizard",
		type:{
			pet:0,
			mount:0,
			description:"desert animal, jungle animal",
		},
	},{
		name:"Marsupial Mole",
		type:{
			pet:0,
			mount:0,
			description:"desert animal",
		},
	},{
		name:"Meerkat",
		type:{
			pet:0,
			mount:0,
			description:"desert animal, forest animal",
		},
	},{
		name:"Nine-banded Armadillo",
		type:{
			pet:0,
			mount:0,
			description:"desert animal",
		},
	},{
		name:"Onager",
		type:{
			pet:0,
			mount:0,
			description:"desert animal",
		},
	},{
		name:"Oryx",
		type:{
			pet:0,
			mount:0,
			description:"desert animal",
		},
	},{
		name:"Pack Rat",
		type:{
			pet:0,
			mount:0,
			description:"desert animal",
		},
	},{
		name:"Penguin",
		type:{
			pet:0,
			mount:0,
			description:"desert animal",
		},
	},{
		name:"Peruvian Fox",
		type:{
			pet:0,
			mount:0,
			description:"desert animal",
		},
	},{
		name:"Phrynosoma Platyrhinos",
		type:{
			pet:0,
			mount:0,
			description:"desert animal",
		},
	},{
		name:"Pocket Mouse",
		type:{
			pet:0,
			mount:0,
			description:"desert animal",
		},
	},{
		name:"Polar Bear",
		type:{
			pet:0,
			mount:0,
			description:"desert animal",
		},
	},{
		name:"Quokka",
		type:{
			pet:0,
			mount:0,
			description:"desert animal",
		},
	},{
		name:"Rattlesnakes",
		type:{
			pet:0,
			mount:0,
			description:"desert animal",
		},
	},{
		name:"Roadrunner",
		type:{
			pet:0,
			mount:0,
			description:"desert animal",
		},
	},{
		name:"Sand Cobra",
		type:{
			pet:0,
			mount:0,
			description:"desert animal",
		},
	},{
		name:"Sandgrouse",
		type:{
			pet:0,
			mount:0,
			description:"desert animal",
		},
	},{
		name:"Scorpion",
		type:{
			pet:0,
			mount:0,
			description:"desert animal",
		},
	},{
		name:"Serval",
		type:{
			pet:0,
			mount:0,
			description:"desert animal, forest animal",
		},
	},{
		name:"Sidewinder",
		type:{
			pet:0,
			mount:0,
			description:"desert animal",
		},
	},{
		name:"Tarantula",
		type:{
			pet:0,
			mount:0,
			description:"desert animal",
		},
	},{
		name:"Veiled Chameleon",
		type:{
			pet:0,
			mount:0,
			description:"desert animal",
		},
	},{
		name:"White-tailed Deer",
		type:{
			pet:0,
			mount:0,
			description:"desert animal",
		},
	},{
		name:"Nubian Vulture",
		type:{
			pet:0,
			mount:0,
			description:"desert bird",
		},
	},{
		name:"Griffin Vulture",
		type:{
			pet:0,
			mount:0,
			description:"desert bird",
		},
	},{
		name:"Jackal Buzzard",
		type:{
			pet:0,
			mount:0,
			description:"desert bird",
		},
	},{
		name:"Bald Eagle",
		type:{
			pet:0,
			mount:0,
			description:"desert bird",
		},
	},{
		name:"Egyptian Vulture",
		type:{
			pet:0,
			mount:0,
			description:"desert bird",
		},
	},{
		name:"Fan-tailed Raven",
		type:{
			pet:0,
			mount:0,
			description:"desert bird",
		},
	},{
		name:"Lappet-faced Vulture",
		type:{
			pet:0,
			mount:0,
			description:"desert bird",
		},
	},{
		name:"Great Indian Bustard",
		type:{
			pet:0,
			mount:0,
			description:"desert bird",
		},
	},{
		name:"Caspian Tiger",
		type:{
			pet:0,
			mount:0,
			description:"jungle animal",
		},
	},{
		name:"Leopard",
		type:{
			pet:0,
			mount:0,
			description:"jungle animal",
		},
	},{
		name:"Lion",
		type:{
			pet:0,
			mount:0,
			description:"jungle animal",
		},
	},{
		name:"Aardvark",
		type:{
			pet:0,
			mount:0,
			description:"jungle animal",
		},
	},{
		name:"Alligator",
		type:{
			pet:0,
			mount:0,
			description:"jungle animal",
		},
	},{
		name:"Armadillo",
		type:{
			pet:0,
			mount:0,
			description:"jungle animal",
		},
	},{
		name:"Baboon",
		type:{
			pet:0,
			mount:0,
			description:"jungle animal",
		},
	},{
		name:"Bear",
		type:{
			pet:0,
			mount:0,
			description:"jungle animal",
		},
	},{
		name:"Bison",
		type:{
			pet:0,
			mount:0,
			description:"jungle animal",
		},
	},{
		name:"Chimpanzee",
		type:{
			pet:0,
			mount:0,
			description:"jungle animal",
		},
	},{
		name:"Coyote",
		type:{
			pet:0,
			mount:0,
			description:"jungle animal, desert animal",
		},
	},{
		name:"Crocodile",
		type:{
			pet:0,
			mount:0,
			description:"jungle animal, forest animal",
		},
	},{
		name:"Deer",
		type:{
			pet:0,
			mount:0,
			description:"jungle animal",
		},
	},{
		name:"Giraffe",
		type:{
			pet:0,
			mount:0,
			description:"jungle animal",
		},
	},{
		name:"Hippopotamus",
		type:{
			pet:0,
			mount:0,
			description:"jungle animal",
		},
	},{
		name:"Koala Bear",
		type:{
			pet:0,
			mount:0,
			description:"jungle animal",
		},
	},{
		name:"Lynx",
		type:{
			pet:0,
			mount:0,
			description:"jungle animal, forest animal, mountain animal",
		},
	},{
		name:"Monkey",
		type:{
			pet:0,
			mount:0,
			description:"jungle animal",
		},
	},{
		name:"Red Panda",
		type:{
			pet:0,
			mount:0,
			description:"jungle animal",
		},
	},{
		name:"Rhinoceros",
		type:{
			pet:0,
			mount:0,
			description:"jungle animal",
		},
	},{
		name:"Skunk",
		type:{
			pet:0,
			mount:0,
			description:"desert animal, forest animal, jungle animal",
		},
	},{
		name:"Snake",
		type:{
			pet:0,
			mount:0,
			description:"jungle animal",
		},
	},{
		name:"Turtle",
		type:{
			pet:0,
			mount:0,
			description:"jungle animal",
		},
	},{
		name:"Wild Dog",
		type:{
			pet:0,
			mount:0,
			description:"jungle animal",
		},
	},{
		name:"Wolf",
		type:{
			pet:0,
			mount:0,
			description:"jungle animal",
		},
	},{
		name:"Zebra",
		type:{
			pet:0,
			mount:0,
			description:"jungle animal",
		},
	},{
		name:"Falcon",
		type:{
			pet:0,
			mount:0,
			description:"jungle bird",
		},
	},{
		name:"English Mastiff",
		type:{
			pet:0,
			mount:0,
			description:"mountain animal",
		},
	},{
		name:"Cougar",
		type:{
			pet:0,
			mount:0,
			description:"mountain animal, jungle animal",
		},
	},{
		name:"Bobcat",
		type:{
			pet:0,
			mount:0,
			description:"mountain animal",
		},
	},{
		name:"Andean Mountain Cat",
		type:{
			pet:0,
			mount:0,
			description:"mountain animal",
		},
	},{
		name:"Chinchilla",
		type:{
			pet:0,
			mount:0,
			description:"mountain animal",
		},
	},{
		name:"Ibex",
		type:{
			pet:0,
			mount:0,
			description:"mountain animal, desert animal",
		},
	},{
		name:"Llama",
		type:{
			pet:0,
			mount:0,
			description:"mountain animal, desert animal",
		},
	},{
		name:"Mountain Goat",
		type:{
			pet:0,
			mount:0,
			description:"mountain animal",
		},
	},{
		name:"Mountain Kingsnake",
		type:{
			pet:0,
			mount:0,
			description:"mountain animal",
		},
	},{
		name:"Mountain Lion",
		type:{
			pet:0,
			mount:0,
			description:"mountain animal",
		},
	},{
		name:"Panda",
		type:{
			pet:0,
			mount:0,
			description:"mountain animal",
		},
	},{
		name:"Pike",
		type:{
			pet:0,
			mount:0,
			description:"mountain animal",
		},
	},{
		name:"Puma",
		type:{
			pet:0,
			mount:0,
			description:"mountain animal",
		},
	},{
		name:"Yak",
		type:{
			pet:0,
			mount:0,
			description:"mountain animal",
		},
	},{
		name:"Swamp Harrier",
		type:{
			pet:0,
			mount:0,
			description:"forest bird, mountain bird",
		},
	}
];

var main = new CreatureGenerator(data);