import {equipment, equipmentThisLevel, level} from "./gameState.svelte";
import {get} from "svelte/store";

export const increaseEquipmentThisLevel = () => {
    if (get(level) % 5 === 0) {
        equipmentThisLevel.rainbow.count += 2;
        equipmentThisLevel.bomb.count += 2;
        return;
    }
    if (get(level) % 3 !== 0) {
        equipmentThisLevel.rainbow.count++;
        return;
    }

    equipmentThisLevel.rainbow.count++;
    equipmentThisLevel.bomb.count++;
}

export const increaseEquipment = () => {
    equipment.rainbow.count+= equipmentThisLevel.rainbow.count;
    equipment.bomb.count+= equipmentThisLevel.bomb.count;
}

export const clearEquipmentThisLevel = () => {
    equipmentThisLevel.rainbow.count = 0;
    equipmentThisLevel.bomb.count = 0;
}