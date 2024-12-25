import {equipment, equipmentThisLevel} from "./gameState.svelte";

export const increaseEquipmentThisLevel = () => {
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