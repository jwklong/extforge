import javascriptGenerator from '../javascriptGenerator';
import { registerBlock, registerMutator } from '../register';
import Blockly from 'blockly/core';
import util from '../util';

const categoryPrefix = 'blocks_';
const categoryColor = '#b6f';

function register() {
    registerBlock(`${categoryPrefix}define`, {
        message0: '%1',
        args0: [
            {
                "type": "input_statement",
                "name": "BLOCKS"
            }
        ],
        inputsInline: true,
        colour: categoryColor,
        mutator: `${categoryPrefix}define_mutator`
    }, (block) => {
        return ''
    })
    /** @type {Blockly.Block} */
    const defineMutator = {
        blockId_: "",

        mutationToDom: function () {
            var container = Blockly.utils.xml.createElement('mutation');
            container.setAttribute('blockId', this.blockId_);
            return container;
        },

        domToMutation: function (xmlElement) {
            this.blockId_ = xmlElement.getAttribute('blockId') ?? "";
            this.updateShape_();
        },

        updateShape_: function() {
            for (let i = 0; this.removeInput(`INPUT${i}`, true); i++) {}

            let block = window.blocks[this.blockId_]
            if (!block) return
            
            let i = 0
            for (let field of block.fields) {
                switch (field.type) {
                    case "label":
                        this.appendDummyInput(`INPUT${i}`)
                            .appendField(field.text)
                        break;
                    case "string":
                    case "number":
                    case "boolean":
                        var input = this.appendValueInput(`INPUT${i}`)
                        let reporter = this.workspace.newBlock(`${categoryPrefix}input`)
                        reporter.blockId_ = this.blockId_
                        reporter.fieldId_ = field.id
                        reporter.setShadow(true)
                        reporter.updateShape_()
                        reporter.initSvg()
                        reporter.render()
                        reporter.outputConnection.connect(input.connection)
                        break
                }

                this.moveInputBefore(`INPUT${i}`, `BLOCKS`)

                i++
            }
        }
    }
    registerMutator(
        `${categoryPrefix}define_mutator`,
        defineMutator
    );

    registerBlock(`${categoryPrefix}input`, {
        message0: '',
        output: null,
        inputsInline: true,
        canDragDuplicate: true,
        colour: categoryColor,
        mutator: `${categoryPrefix}input_mutator`
    }, (block) => {
        let root = block.getRootBlock()
        if (!(root.type == `${categoryPrefix}define` && root.blockId_ == block.blockId_)) {
            return `null`
        }

        return `args["${block.fieldId_}"]`
    })
    /** @type {Blockly.Block} */
    const inputMutator = {
        blockId_: "",
        fieldId_: "",

        mutationToDom: function () {
            var container = Blockly.utils.xml.createElement('mutation');
            container.setAttribute('blockId', this.blockId_);
            container.setAttribute('fieldId', this.fieldId_);
            return container;
        },

        domToMutation: function (xmlElement) {
            this.blockId_ = xmlElement.getAttribute('blockId') ?? "";
            this.fieldId_ = xmlElement.getAttribute('fieldId') ?? "";
            this.updateShape_();
        },

        updateShape_: function() {
            let text = ""
            let block
            let field
            try {
                block = window.blocks[this.blockId_]
                field = block.fields.find(v => v.id == this.fieldId_)
                text = field.text
            } catch {}

            this.removeInput("TEXT", true)
            this.appendDummyInput("TEXT")
                .appendField(text)

            if (field) {
                switch (field.type) {
                    case "string":
                        this.setOutput(true, "String")
                        break
                    case "number":
                        this.setOutput(true, "Number")
                        break
                    case "boolean":
                        this.setOutput(true, "Boolean")
                        break
                    default:
                        this.setOutput(true, null)
                }
            } else {
                this.setOutput(true, null)
            }
        }
    }
    registerMutator(
        `${categoryPrefix}input_mutator`,
        inputMutator
    );

    registerBlock(`${categoryPrefix}execute`, {
        message0: '',
        inputsInline: true,
        colour: categoryColor,
        mutator: `${categoryPrefix}execute_mutator`
    }, (block) => {
        let b = window.blocks[block.blockId_]
        if (!b) return "()"

        let object = []
        for (let i = 0; block.getInput(`INPUT${i}`); i++) {
            let field = b.fields[i]
            if (field.type !== "label") {
                object.push(`"${field.id}": ${javascriptGenerator.valueToCode(block, `INPUT${i}`)}`)
            }
        }

        return `await extension["block_${block.blockId_}"]({${object.join(", ")}})`
    })
    /** @type {Blockly.Block} */
    const executeMutator = {
        blockId_: "",

        mutationToDom: function () {
            var container = Blockly.utils.xml.createElement('mutation');
            container.setAttribute('blockId', this.blockId_);
            return container;
        },

        domToMutation: function (xmlElement) {
            this.blockId_ = xmlElement.getAttribute('blockId') ?? "";
            this.updateShape_();
        },

        updateShape_: function() {
            for (let i = 0; this.removeInput(`INPUT${i}`, true); i++) {}

            let block = window.blocks[this.blockId_]
            if (!block) return

            this.setOutput(false)
            this.setPreviousStatement(false)
            this.setNextStatement(false)

            switch (block.type) {
                case "command": {
                    this.setPreviousStatement(true, null)
                    this.setNextStatement(true, null)
                    break
                }
                case "reporter": {
                    this.setOutput(true, ["String", "Number", "Boolean"])
                    break
                }
                case "Boolean": {
                    this.setOutput(true, "Boolean")
                    break
                }
            }
            
            let i = 0
            for (let field of block.fields) {
                switch (field.type) {
                    case "label":
                        this.appendDummyInput(`INPUT${i}`)
                            .appendField(field.text)
                        break;
                    case "string":
                        var input = this.appendValueInput(`INPUT${i}`)
                        input.setCheck("String")
                        var inputInside = this.workspace.newBlock('generic_text')
                        inputInside.setFieldValue(field.default, "TEXT")
                        inputInside.setShadow(true)
                        inputInside.initSvg()
                        inputInside.render()
                        inputInside.outputConnection.connect(input.connection)
                        break
                    case "number":
                        var input = this.appendValueInput(`INPUT${i}`)
                        input.setCheck("Number")
                        var inputInside = this.workspace.newBlock('generic_number')
                        inputInside.setFieldValue(Number(field.default) || 0, "NUMBER")
                        inputInside.setShadow(true)
                        inputInside.initSvg()
                        inputInside.render()
                        inputInside.outputConnection.connect(input.connection)
                        break
                    case "boolean":
                        var input = this.appendValueInput(`INPUT${i}`)
                        input.setCheck("Boolean")
                        break
                }

                i++
            }
        }
    }
    registerMutator(
        `${categoryPrefix}execute_mutator`,
        executeMutator
    );


    registerBlock(`${categoryPrefix}return`, {
        message0: 'return %1',
        args0: [
            {
                "type": "field_input",
                "name": "X",
                "check": null,
                "text": "0",
                "acceptsBlocks": true
            }
        ],
        previousStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        let X = javascriptGenerator.valueToCode(block, 'X')
        return `return (${X})`
    })
}

export default register