import javascriptGenerator from '../javascriptGenerator';
import { registerBlock } from '../register';
import util from "../util";

const categoryPrefix = 'sprites_';
const categoryColor = '#18f';

function register() {
    registerBlock(`${categoryPrefix}stage`, {
        message0: 'stage sprite',
        args0: [],
        output: "Sprite",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        return ["Scratch.vm.runtime.getTargetForStage()", 0];
    })
    registerBlock(`${categoryPrefix}getSpriteFromName`, {
      message0: "sprite named %1",
      args0: [
        {
          "type": "field_input",
          "name": "NAME",
          "check": "String",
          "text": "Sprite1",
          "acceptsBlocks": true
        }
      ],
      output: "Sprite",
      inputsInline: true,
      colour: categoryColor
    }, (block) => {
      const INPUT = javascriptGenerator.valueToCode(block, 'NAME');
      return [`Scratch.vm.runtime.getSpriteTargetByName(String(${INPUT}))`, 0]
    })
    registerBlock(`${categoryPrefix}doesSpriteWithNameExist`, {
      message0: "is there a sprite named %1?",
      args0: [
        {
          "type": "field_input",
          "name": "NAME",
          "check": "String",
          "text": "Sprite1",
          "acceptsBlocks": true
        }
      ],
      output: "Boolean",
      inputsInline: true,
      colour: categoryColor
    }, (block) => {
      const INPUT = javascriptGenerator.valueToCode(block, 'NAME');
      return [`!!Scratch.vm.runtime.getSpriteTargetByName(String(${INPUT}))`, 0]
    })
    registerBlock(`${categoryPrefix}getSpriteThatRanBlock`, {
      message0: "sprite that ran this block",
      args0: [],
      output: "Sprite",
      inputsInline: true,
      colour: categoryColor
    }, (block) => {
      return [`(()=>{if(typeof blockUtils === "undefined")return null;else return blockUtils.target})()`, 0]
    })
    registerBlock(`${categoryPrefix}getListOfSprites`, {
      message0: "get list of all sprites/clones",
      args0: [],
      output: "List",
      inputsInline: true,
      colour: categoryColor
    }, (block) => {
      return [`(new Proxy(Scratch.vm.runtime.executableTargets, {set: ()=>{}}))`, 0]
    })
    registerBlock(`${categoryPrefix}getClonesOfSprite`, {
      message0: "clones of %1 (including itself)",
      args0: [
        {
          "type": "input_value",
          "name": "SPRITE",
          "check": "Sprite",
        }
      ],
      output: "List",
      inputsInline: true,
      colour: categoryColor
    }, (block) => {
      const SPRITE = `(${javascriptGenerator.valueToCode(block, 'SPRITE') || "null"})`;
      return [`((spriteVariable)=>spriteVariable?(new Proxy(spriteVariable.sprite.clones, {set: ()=>{}})):[])(${SPRITE})`, 0]
    })
    registerBlock(`${categoryPrefix}getNameOfSprite`, {
      message0: "get name of %1",
      args0: [
        {
          "type": "input_value",
          "name": "SPRITE",
          "check": "Sprite",
        }
      ],
      output: "Number",
      inputsInline: true,
      colour: categoryColor
    }, (block) => {
      const SPRITE = javascriptGenerator.valueToCode(block, 'SPRITE') || "null";
      return [`((spriteVariable)=>spriteVariable?spriteVariable.getName():"")(${SPRITE})`, 0]
    })
    registerBlock(`${categoryPrefix}getIdOfSprite`, {
      message0: "get id of %1",
      args0: [
        {
          "type": "input_value",
          "name": "SPRITE",
          "check": "Sprite",
        }
      ],
      output: "Number",
      inputsInline: true,
      colour: categoryColor
    }, (block) => {
      const SPRITE = javascriptGenerator.valueToCode(block, 'SPRITE') || "null";
      return [`((spriteVariable)=>spriteVariable?spriteVariable.id:"")(${SPRITE})`, 0]
    })
    registerBlock(`${categoryPrefix}getXposOfSprite`, {
      message0: "get x position of %1",
      args0: [
        {
          "type": "input_value",
          "name": "SPRITE",
          "check": "Sprite",
        }
      ],
      output: "Number",
      inputsInline: true,
      colour: categoryColor
    }, (block) => {
      const SPRITE = javascriptGenerator.valueToCode(block, 'SPRITE') || "null";
      return [`((spriteVariable)=>spriteVariable?spriteVariable.x:NaN)(${SPRITE})`, 0]
    })
    registerBlock(`${categoryPrefix}getYposOfSprite`, {
      message0: "get y position of %1",
      args0: [
        {
          "type": "input_value",
          "name": "SPRITE",
          "check": "Sprite",
        }
      ],
      output: "Number",
      inputsInline: true,
      colour: categoryColor
    }, (block) => {
      const SPRITE = javascriptGenerator.valueToCode(block, 'SPRITE') || "null";
      return [`((spriteVariable)=>spriteVariable?spriteVariable.y:NaN)(${SPRITE})`, 0]
    })
    registerBlock(`${categoryPrefix}getDirectionOfSprite`, {
      message0: "get direction of %1",
      args0: [
        {
          "type": "input_value",
          "name": "SPRITE",
          "check": "Sprite",
        }
      ],
      output: "Number",
      inputsInline: true,
      colour: categoryColor
    }, (block) => {
      const SPRITE = javascriptGenerator.valueToCode(block, 'SPRITE') || "null";
      return [`((spriteVariable)=>spriteVariable?spriteVariable.direction:NaN)(${SPRITE})`, 0]
    })
    registerBlock(`${categoryPrefix}setXposOfSprite`, {
      message0: 'set x position of %1 to %2',
      args0: [
        {
          "type": "input_value",
          "name": "SPRITE",
          "check": "Sprite",
        }, 
        {
          "type": "field_number",
          "name": "INPUT",
          "check": null,
          "text": "0",
          "acceptsBlocks": true
        }
      ],
      previousStatement: null,
      nextStatement: null,
      inputsInline: true,
      colour: categoryColor
    }, (block) => {
        const SPRITE = javascriptGenerator.valueToCode(block, 'SPRITE') || "null";
        const VALUE = javascriptGenerator.valueToCode(block, 'INPUT');
        const code = `((spriteVariable)=>(spriteVariable?spriteVariable.setXY(Scratch.Cast.toNumber(${VALUE}), spriteVariable.y):0))(${SPRITE});`;
        return `${code}\n`;
    })
    registerBlock(`${categoryPrefix}setYposOfSprite`, {
      message0: 'set y position of %1 to %2',
      args0: [
        {
          "type": "input_value",
          "name": "SPRITE",
          "check": "Sprite",
        }, 
        {
          "type": "field_number",
          "name": "INPUT",
          "check": null,
          "text": "0",
          "acceptsBlocks": true
        }
      ],
      previousStatement: null,
      nextStatement: null,
      inputsInline: true, 
      colour: categoryColor
    }, (block) => {
      const SPRITE = javascriptGenerator.valueToCode(block, 'SPRITE') || "null";
        const VALUE = javascriptGenerator.valueToCode(block, 'INPUT');
        const code = `((spriteVariable)=>(spriteVariable?spriteVariable.setXY(spriteVariable.x, Scratch.Cast.toNumber(${VALUE})):0))(${SPRITE});`;
        return `${code}\n`;
    })
    registerBlock(`${categoryPrefix}setDirectionOfSprite`, {
      message0: 'set direction of %1 to %2',
      args0: [
        {
          "type": "input_value",
          "name": "SPRITE",
          "check": "Sprite",
        }, 
        {
          "type": "field_number",
          "name": "INPUT",
          "check": null,
          "text": "90",
          "acceptsBlocks": true
        }
      ],
      previousStatement: null,
      nextStatement: null,
      inputsInline: true,
      colour: categoryColor
    }, (block) => {
      const SPRITE = javascriptGenerator.valueToCode(block, 'SPRITE') || "null";
        const VALUE = javascriptGenerator.valueToCode(block, 'INPUT');
        const code = `((spriteVariable)=>(spriteVariable?spriteVariable.setDirection(Scratch.Cast.toNumber(${VALUE})):0))(${SPRITE});`;
        return `${code}\n`;
    })
    registerBlock(`${categoryPrefix}hasSpriteBeenDeleted`, {
      message0: "has %1 been deleted?",
      args0: [
        {
          "type": "input_value",
          "name": "SPRITE",
          "check": "Sprite",
        }
      ],
      output: "Boolean",
      inputsInline: true,
      colour: categoryColor
    }, (block) => {
      const SPRITE = javascriptGenerator.valueToCode(block, 'SPRITE') || "null";
      return [`((spriteVariable)=>spriteVariable?Scratch.vm.runtime.executableTargets.indexOf(spriteVariable) !== -1:true)(${SPRITE})`, 0]
    })
    registerBlock(`${categoryPrefix}isSpriteAClone`, {
      message0: "is %1 a clone?",
      args0: [
        {
          "type": "input_value",
          "name": "SPRITE",
          "check": "Sprite",
        }
      ],
      output: "Boolean",
      inputsInline: true,
      colour: categoryColor
    }, (block) => {
      const SPRITE = javascriptGenerator.valueToCode(block, 'SPRITE') || "null";
      return [`!((spriteVariable)=>spriteVariable?spriteVariable.isOriginal:true)(${SPRITE})`, 0]
    })
    registerBlock(`${categoryPrefix}getVarOfSprite`, {
      message0: 'get variable %1 of %2',
      args0: [
        {
          "type": "field_input",
          "name": "INPUT",
          "check": null,
          "text": "my sprite-only variable",
          "acceptsBlocks": true
        },
        {
          "type": "input_value",
          "name": "SPRITE",
          "check": "Sprite",
        }, 
      ],
      output: null,
      inputsInline: true,
      colour: categoryColor
    }, (block) => {
        const SPRITE = javascriptGenerator.valueToCode(block, 'SPRITE') || "null";
        const VALUE = javascriptGenerator.valueToCode(block, 'INPUT');
        return [`((spriteVariable)=>spriteVariable?(spriteVariable.lookupVariableByNameAndType(String(${VALUE})) || {value: 0}).value:NaN)(${SPRITE})`, 0]
    })
    registerBlock(`${categoryPrefix}setVarOfSprite`, {
      message0: 'set variable %1 of %2 to %3',
      args0: [
        {
          "type": "field_input",
          "name": "INPUT",
          "check": null,
          "text": "my sprite-only variable",
          "acceptsBlocks": true
        },
        {
          "type": "input_value",
          "name": "SPRITE",
          "check": "Sprite",
        }, 
        {
          "type": "field_input",
          "name": "VALUE",
          "check": null,
          "text": "0",
          "acceptsBlocks": true
        },
      ],
      previousStatement: null,
      nextStatement: null,
      inputsInline: true,
      colour: categoryColor
    }, (block) => {
        const SPRITE = javascriptGenerator.valueToCode(block, 'SPRITE') || "null";
        const INPUT = javascriptGenerator.valueToCode(block, 'INPUT');
        const VALUE = javascriptGenerator.valueToCode(block, 'VALUE')
        return `((spriteVariable)=>(spriteVariable?(spriteVariable.lookupVariableByNameAndType(String(${INPUT})) || {value: 0}).value = String(${VALUE}):0))(${SPRITE});`
    })
}

export default register;