import javascriptGenerator from '../javascriptGenerator';
import { registerBlock } from '../register';

const categoryPrefix = 'sprites_';
const categoryColor = '#18f';

function register() {
    /*registerBlock(`${categoryPrefix}evalb`, {
        message0: 'eval %1',
        args0: [
            {
                "type": "field_input",
                "name": "INPUT",
                "check": "String",
                "text": "alert(\"hi\")",
                "acceptsBlocks": true
            },
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const INPUT = javascriptGenerator.valueToCode(block, 'INPUT');
        const code = `eval(${INPUT})`;
        return `${code}\n`;
    })*/
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
      message0: "get sprite named %1",
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
      return [`(()=>{const name = String(${INPUT}); const res = Scratch.vm.runtime.getSpriteTargetByName(name); if (!res) throw "Unable to find sprite named " + name; return res;})()`, 0]
    })
}

export default register;