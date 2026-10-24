import { Cache } from "./decorators";
import { SpellRepository, WizardRepository } from "./repository";
import type { House, SpellCastEvent, Wizard } from "./types";

const wizards = new WizardRepository();
const spells = new SpellRepository();


const harry = wizards.create({ name: "Harry Potter", house: "Gryffindor", level: 5, active: true });
wizards.create({ name: "Hermione Granger", house: "Gryffindor", level: 6, active: true });
wizards.create({ name: "Draco Malfoy", house: "Slytherin", level: 5, active: true });
wizards.create({ name: "Luna Lovegood", house: "Ravenclaw", level: 4, active: true });
console.log(harry); 


console.log(wizards.findByHouse("Gryffindor").map((w) => w.name));

function handleSpellCast(event: SpellCastEvent): void {
  console.log(`Wizard ${event.wizardId} cast ${event.spellName}`);
}

handleSpellCast({ type: "spell-cast", wizardId: 1, spellName: "Expelliarmus" });


spells.add({ id: 102, name: "Protego", category: "defense", power: 50 });
console.log("Sort valide ajouté :", spells.getAll().length, "sort(s)");

try {
  spells.add({ id: 103, name: "Invalid Spell", category: "attack", power: -10 });
} catch (error) {
  console.log("Sort refusé :", (error as Error).message);
}

class SpellCalculator {
  @Cache
  calculatePower(basePower: number, multiplier: number): number {
    console.log("Calculating...");
    return basePower * multiplier;
  }
}

const calculator = new SpellCalculator();
console.log(calculator.calculatePower(10, 3)); 
console.log(calculator.calculatePower(10, 3)); 
console.log(calculator.calculatePower(5, 2)); 

const validHouses: readonly House[] = ["Gryffindor", "Slytherin", "Ravenclaw", "Hufflepuff"];

function isHouse(value: unknown): value is House {
  return typeof value === "string" && validHouses.some((house) => house === value);
}

function isWizard(value: unknown): value is Wizard {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === "number" &&
    typeof candidate.name === "string" &&
    isHouse(candidate.house) &&
    typeof candidate.level === "number" &&
    typeof candidate.active === "boolean"
  );
}

const validData: unknown = { id: 1, name: "Harry Potter", house: "Gryffindor", level: 5, active: true };
const invalidData: unknown = { id: 2, name: "Viktor", house: "Durmstrang", level: 5, active: true };

console.log(isWizard(validData)); 
console.log(isWizard(invalidData)); 
