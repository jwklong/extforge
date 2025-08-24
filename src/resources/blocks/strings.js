import javascriptGenerator from '../javascriptGenerator';
import { registerBlock, registerMutator } from '../register';
import Blockly from 'blockly/core';

const categoryPrefix = 'strings_';
const categoryColor = '#6db';

function register() {
    registerBlock(`${categoryPrefix}string`, {
        message0: '%1',
        args0: [
            {
                "type": "field_input",
                "name": "INPUT",
                "check": null,
                "text": "apple",
                "acceptsBlocks": true
            },
        ],
        output: "String",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const INPUT = javascriptGenerator.valueToCode(block, 'INPUT');
        const code = `Scratch.Cast.toString(${INPUT})`;
        return [`${code}`, 0];
    })

    registerBlock(`${categoryPrefix}join`, {
        message0: '',
        args0: [],
        output: "String",
        inputsInline: true,
        colour: categoryColor,
        mutator: `${categoryPrefix}join_mutator`
    }, (block) => {
        let strings = []

        for (let i = 0; block.getInput(`ITEM${i}`); i++) {
            const INPUT = javascriptGenerator.valueToCode(block, `ITEM${i}`);
            strings.push(INPUT)
        }

        const code = `String.prototype.concat(${strings.join(", ")})`
        return [`${code}`, 0];
    })
    registerBlock(`${categoryPrefix}join_mutator_join`, {
        message0: 'join',
        args0: [],
        nextStatement: null,
        inputsInline: true,
        enableContextMenu: false,
        colour: categoryColor,
    }, (block) => {})
    registerBlock(`${categoryPrefix}join_mutator_item`, {
        message0: 'item',
        args0: [],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor,
    }, (block) => {})

    registerBlock(`${categoryPrefix}repeat`, {
        message0: 'repeat %1 %2 times',
        args0: [
            {
                "type": "field_input",
                "name": "TEXT",
                "check": "String",
                "text": "apple",
                "acceptsBlocks": true
            },
            {
                "type": "field_number",
                "name": "REPEAT",
                "check": "Number",
                "value": 10,
                "acceptsBlocks": true
            }
        ],
        output: "String",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const TEXT = javascriptGenerator.valueToCode(block, 'TEXT');
        const REPEAT = javascriptGenerator.valueToCode(block, 'REPEAT');
        const code = `(${TEXT}.repeat(${REPEAT}))`;
        return [`${code}`, 0];
    })

    registerBlock(`${categoryPrefix}split`, {
        message0: 'split %1 with delimiter %2',
        args0: [
            {
                "type": "field_input",
                "name": "TEXT",
                "check": "String",
                "text": "a,b,c",
                "acceptsBlocks": true
            },
            {
                "type": "field_input",
                "name": "DELIMIT",
                "check": "String",
                "text": ",",
                "acceptsBlocks": true
            },
        ],
        output: "List",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const TEXT = javascriptGenerator.valueToCode(block, 'TEXT');
        const DELIMIT = javascriptGenerator.valueToCode(block, 'DELIMIT');
        const code = `(${TEXT}.split(${DELIMIT}))`;
        return [`${code}`, 0];
    })

    registerBlock(`${categoryPrefix}length`, {
        message0: 'length of %1',
        args0: [
            {
                "type": "field_input",
                "name": "TEXT",
                "check": "String",
                "text": "apple",
                "acceptsBlocks": true
            }
        ],
        output: "Number",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const TEXT = javascriptGenerator.valueToCode(block, 'TEXT');
        const code = `(${TEXT}.length)`;
        return [`${code}`, 0];
    })

    registerBlock(`${categoryPrefix}substring`, {
        message0: 'substring %1 to %2 of %3',
        args0: [
            {
                "type": "field_number",
                "name": "FROM",
                "check": "Number",
                "value": 1,
                "min": 1,
                "acceptsBlocks": true
            },
            {
                "type": "field_number",
                "name": "TO",
                "check": "Number",
                "value": 3,
                "acceptsBlocks": true
            },
            {
                "type": "field_input",
                "name": "TEXT",
                "check": "String",
                "text": "apple",
                "acceptsBlocks": true
            }
        ],
        output: "String",
        inputsInline: true,
        colour: categoryColor,
        extensions: [`${categoryPrefix}substring_extension`]
    }, (block) => {
        const FROM = javascriptGenerator.valueToCode(block, 'FROM');
        const TO = javascriptGenerator.valueToCode(block, 'TO');
        const TEXT = javascriptGenerator.valueToCode(block, 'TEXT');
        const code = `(${TEXT}.substring(${FROM}, ${TO}))`;
        return [`${code}`, 0];
    })
    Blockly.Extensions.unregister(`${categoryPrefix}substring_extension`)
    Blockly.Extensions.register(`${categoryPrefix}substring_extension`, function() {
        this.setOnChange(function() {
            const FROM = this.getFieldInput('FROM').getTargetField()
            const TO = this.getFieldInput('TO').getTargetField()
            if (!TO) return
            if (!FROM) {
                TO.setMin(1);
                if (1 > TO.getValue()) TO.setValue(1);
                return
            }
            TO.setMin(FROM.getValue());
            if (FROM.getValue() > TO.getValue()) TO.setValue(FROM.getValue());
        })
    })

    registerBlock(`${categoryPrefix}contains`, {
        message0: '%1 %2 %3',
        args0: [
            {
                "type": "field_input",
                "name": "TEXT1",
                "check": "String",
                "text": "apple",
                "acceptsBlocks": true
            },
            {
                "type": "field_dropdown",
                "name": "CHOICE",
                "options": [
                    ["contains", "includes"],
                    ["starts with", "startsWith"],
                    ["ends with", "endsWith"]
                ]
            },
            {
                "type": "field_input",
                "name": "TEXT2",
                "check": "String",
                "text": "a",
                "acceptsBlocks": true
            }
        ],
        output: "Boolean",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const TEXT1 = javascriptGenerator.valueToCode(block, 'TEXT1');
        const CHOICE = block.getFieldValue("CHOICE")
        const TEXT2 = javascriptGenerator.valueToCode(block, 'TEXT2');
        const code = `(${TEXT1}.${CHOICE}(${TEXT2}))`;
        return [`${code}`, 0];
    })

    registerBlock(`${categoryPrefix}log`, {
        message0: 'log %1',
        args0: [
            {
                "type": "field_input",
                "name": "TEXT",
                "check": null,
                "text": "hello world",
                "acceptsBlocks": true
            }
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const TEXT = javascriptGenerator.valueToCode(block, 'TEXT');
        const code = `console.log(${TEXT});`
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}amountof`, {
        message0: 'amount of %1 in %2',
        args0: [
            {
                "type": "field_input",
                "name": "NEEDLE",
                "check": "String",
                "text": "p",
                "acceptsBlocks": true
            },
            {
                "type": "field_input",
                "name": "HAYSTACK",
                "check": "String",
                "text": "apple",
                "acceptsBlocks": true
            }
        ],
        output: "Number",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const NEEDLE = javascriptGenerator.valueToCode(block, 'NEEDLE');
        const HAYSTACK = javascriptGenerator.valueToCode(block, 'HAYSTACK');
        const code = `ExtForge.Utils.countString(${HAYSTACK}, ${NEEDLE})`;
        return [`${code}`, 0];
    })

    registerBlock(`${categoryPrefix}replace`, {
        message0: 'replace %1 in %2 with %3',
        args0: [
            {
                "type": "field_input",
                "name": "X",
                "check": "String",
                "text": "foo",
                "acceptsBlocks": true
            },
            {
                "type": "field_input",
                "name": "Y",
                "check": "String",
                "text": "bar",
                "acceptsBlocks": true
            },
            {
                "type": "field_input",
                "name": "Z",
                "check": "String",
                "text": "baz",
                "acceptsBlocks": true
            }
        ],
        output: "String",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const X = javascriptGenerator.valueToCode(block, 'X');
        const Y = javascriptGenerator.valueToCode(block, 'Y');
        const Z = javascriptGenerator.valueToCode(block, 'Z');
        const code = `(${Y}).replaceAll(${X}, ${Z})`;
        return [`${code}`, 0];
    })

    const strings_join_mutator = {
        items_: 0,

        mutationToDom: function () {
            const container = Blockly.utils.xml.createElement('mutation');
            container.setAttribute('items', String(this.items_));
            return container;
        },

        domToMutation: function (xmlElement) {
            this.items_ = parseInt(xmlElement.getAttribute('items'));
            this.updateShape_();
        },

        decompose: function (workspace) {
            const containerBlock = workspace.newBlock(`${categoryPrefix}join_mutator_join`);
            containerBlock.initSvg();
            let connection = containerBlock.nextConnection;
            for (let i = 0; i < this.items_; i++) {
                const itemBlock = workspace.newBlock(`${categoryPrefix}join_mutator_item`);
                itemBlock.initSvg();
                connection.connect(itemBlock.previousConnection);
                connection = itemBlock.nextConnection;
            }
            return containerBlock;
        },

        compose: function (containerBlock) {
            let clauseBlock = containerBlock.nextConnection.targetBlock();

            const connections = []
            const oldItems = this.items_

            while (clauseBlock) {
                if (clauseBlock.isInsertionMarker()) {
                    clauseBlock = clauseBlock.getNextBlock()
                    continue;
                }

                connections.push(clauseBlock.valueConnection_)
                clauseBlock = clauseBlock.getNextBlock();
            }

            for (let i = 0; i < this.items_; i++) {
                const connection = this.getInput(`ITEM${i}`).connection.targetConnection;
                if (connection && !connection.sourceBlock_.isShadow() && connections.indexOf(connection) === -1) {
                    connection.disconnect();
                }
            }

            this.items_ = connections.length
            this.updateShape_()

            for (let i = 0; i < this.items_; i++) {
                if (connections[i] && oldItems !== this.items_) {
                    const connection = this.getInput(`ITEM${i}`).connection.targetConnection;
                    const block = connection.sourceBlock_;
                    connection.disconnect();
                    block.dispose(true)
                }
                Blockly.Mutator.reconnect(connections[i], this, `ITEM${i}`);
            }
        },

        saveConnections: function (containerBlock) {
            let clauseBlock = containerBlock.nextConnection.targetBlock();
            let i = 0;
            while (clauseBlock) {
                if (clauseBlock.isInsertionMarker()) {
                    clauseBlock = clauseBlock.getNextBlock()
                    continue;
                }

                const input = this.getInput(`ITEM${i}`);
                clauseBlock.valueConnection_ = input
                && input.connection.targetConnection
                && input.connection.targetConnection.sourceBlock_
                &&!input.connection.targetConnection.sourceBlock_.isShadow()
                && input.connection.targetConnection

                i++;
                clauseBlock = clauseBlock.getNextBlock();
            }
        },

        updateShape_: function () {
            if (this.items_ > 0 && this.getInput('EMPTY')) {
                this.removeInput('EMPTY');
            } else if (this.items_ == 0 && !this.getInput('EMPTY')) {
                this.appendDummyInput('EMPTY')
                    .appendField("empty string");
            }

            for (let i = 0; i < this.items_; i++) {
                if (!this.getInput(`ITEM${i}`)) {
                    const input = this.appendValueInput(`ITEM${i}`)
                                      .setAlign(Blockly.ALIGN_RIGHT);
                    input.setCheck("String")
                    const inputInside = this.workspace.newBlock('generic_text')
                    inputInside.setShadow(true)
                    inputInside.initSvg()
                    inputInside.render()
                    inputInside.outputConnection.connect(input.connection)
                    if (i === 0) {
                        input.appendField("join");
                    }
                }
            }

            for (let i = this.items_; this.getInput(`ITEM${i}`); i++) {
                this.removeInput(`ITEM${i}`);
            }
        }
    }
    registerMutator(
        `${categoryPrefix}join_mutator`,
        strings_join_mutator,
        null,
        [`${categoryPrefix}join_mutator_item`],
    );
}

export default register;