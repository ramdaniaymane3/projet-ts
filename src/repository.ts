import { ValidateSpellPower } from "./decorators";
import type { NewWizard, Spell, Wizard } from "./types";


export class Repository<T extends { id: number }> {
  protected items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  getAll(): T[] {
    return [...this.items];
  }

  findById(id: number): T | undefined {
    return this.items.find((item) => item.id === id);
  }
}

export class WizardRepository extends Repository<Wizard> {
  private nextId = 1;

  
  create(data: NewWizard): Wizard {
    const wizard: Wizard = { id: this.nextId++, ...data };
    this.add(wizard);
    return wizard;
  }

  
  findByHouse(house: Wizard["house"]): Wizard[] {
    return this.getAll().filter((wizard) => wizard.house === house);
  }
}

export class SpellRepository extends Repository<Spell> {
  @ValidateSpellPower
  override add(spell: Spell): void {
    super.add(spell);
  }
}
