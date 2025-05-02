import javascriptGenerator from '../javascriptGenerator';
import { registerBlock, registerMutator } from '../register';
import Blockly from 'blockly/core';
import util from '../util';

const categoryPrefix = 'lists_';
const categoryColor = '#f76';

function register() {
    registerBlock(`${categoryPrefix}create`, {
        message0: '',
        args0: [],
        inputsInline: false,
        output: 'List',
        colour: categoryColor,
        mutator: `${categoryPrefix}create_mutator`
    }, (block) => {
        let code = '['

        for (let i = 0; block.getInput(`ITEM${i}`); i++) {
            const ITEM = javascriptGenerator.valueToCode(block, `ITEM${i}`) || "null";
            code += `${ITEM}${block.getInput(`ITEM${i+1}`) ? ", " : ""}`
        }

        code += ']'
        return [`${code}`, 0];
    })
    registerBlock(`${categoryPrefix}create_mutator_list`, {
        message0: 'list',
        args0: [],
        nextStatement: null,
        inputsInline: true,
        enableContextMenu: false,
        colour: categoryColor,
    }, (block) => {})
    registerBlock(`${categoryPrefix}create_mutator_item`, {
        message0: 'item',
        args0: [],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor,
    }, (block) => {})

    registerBlock(`${categoryPrefix}get`, {
        message0: 'get item %1 of %2',
        args0: [
            {
                "type": "field_number",
                "name": "INDEX",
                "check": "Number",
                "value": 1,
                "acceptsBlocks": true
            },
            {
                "type": "input_value",
                "name": "INPUT",
                "check": "List"
            }
        ],
        inputsInline: true,
        output: null,
        colour: categoryColor,
    }, (block) => {
        const INDEX = javascriptGenerator.valueToCode(block, 'INDEX')
        const INPUT = javascriptGenerator.valueToCode(block, 'INPUT')
        const code = `(${INPUT}[${INDEX}])`;
        return [`${code}`, 0];
    })
    registerBlock(`${categoryPrefix}set`, {
        message0: 'set item %1 of %2 to %3',
        args0: [
            {
                "type": "field_number",
                "name": "INDEX",
                "check": "Number",
                "value": 1,
                "acceptsBlocks": true
            },
            {
                "type": "input_value",
                "name": "INPUT",
                "check": "List"
            },
            {
                "type": "field_input",
                "name": "TEXT",
                "check": null,
                "text": "",
                "acceptsBlocks": true
            }
        ],
        inputsInline: true,
        output: "List",
        colour: categoryColor,
    }, (block) => {
        const INDEX = javascriptGenerator.valueToCode(block, 'INDEX')
        const INPUT = javascriptGenerator.valueToCode(block, 'INPUT')
        const VALUE = javascriptGenerator.valueToCode(block, 'TEXT')
        const code = `ExtForge.Utils.setList(${INPUT}, ${INDEX}, ${VALUE})`;
        return [`${code}`, 0];
    })
    
    registerBlock(`${categoryPrefix}length`, {
        message0: 'length of %1',
        args0: [
            {
                "type": "input_value",
                "name": "INPUT",
                "check": "List"
            }
        ],
        inputsInline: true,
        output: "Number",
        colour: categoryColor,
    }, (block) => {
        const INPUT = javascriptGenerator.valueToCode(block, 'INPUT')
        const code = `(${INPUT}.length)`;
        return [`${code}`, 0];
    })
    
    registerBlock(`${categoryPrefix}join`, {
        message0: 'join %1 with delimiter %2',
        args0: [
            {
                "type": "input_value",
                "name": "INPUT",
                "check": "List"
            },
            {
                "type": "field_input",
                "name": "TEXT",
                "check": "String",
                "text": ",",
                "acceptsBlocks": true
            }
        ],
        inputsInline: true,
        output: "String",
        colour: categoryColor,
    }, (block) => {
        const INPUT = javascriptGenerator.valueToCode(block, 'INPUT')
        const TEXT = javascriptGenerator.valueToCode(block, 'TEXT')
        const code = `(${INPUT}.join(${TEXT}))`;
        return [`${code}`, 0];
    })
    
    registerBlock(`${categoryPrefix}concat`, {
        message0: 'concat %1 with %2',
        args0: [
            {
                "type": "input_value",
                "name": "LIST1",
                "check": "List"
            },
            {
                "type": "input_value",
                "name": "LIST2",
                "check": "List"
            }
        ],
        inputsInline: true,
        output: "List",
        colour: categoryColor,
    }, (block) => {
        const LIST1 = javascriptGenerator.valueToCode(block, 'LIST1')
        const LIST2 = javascriptGenerator.valueToCode(block, 'LIST2')
        const code = `(${LIST1}.concat(${LIST2}))`;
        return [`${code}`, 0];
    })

    registerBlock(`${categoryPrefix}foreach`, {
        message0: 'for each %1 %2 in %3 %4 %5',
        args0: [
            {
                "type": "input_value",
                "name": "INDEX"
            },
            {
                "type": "input_value",
                "name": "VALUE"
            },
            {
                "type": "input_value",
                "name": "LIST",
                "check": "List"
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "BLOCKS"
            }
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const LIST = javascriptGenerator.valueToCode(block, 'LIST');
        const BLOCKS = javascriptGenerator.statementToCode(block, 'BLOCKS');
        const varlistname = "temp_"+util.randomHex(24)
        const varindexname = "temp_"+util.randomHex(24)
        const code = 
       `var ${varlistname} = ${LIST};
        for (var ${varindexname} in ${varlistname}) {
            ExtForge.Utils.lists_foreach.index.push(${varindexname});
            ExtForge.Utils.lists_foreach.value.push(${varlistname}[${varindexname}]);
            ${BLOCKS}
        };
        ExtForge.Utils.lists_foreach.index.pop();
        ExtForge.Utils.lists_foreach.value.pop();
        `
        return `${code}\n`;
    })
    registerBlock(`${categoryPrefix}foreachindex`, {
        message0: 'index',
        args0: [],
        output: "Number",
        inputsInline: true,
        canDragDuplicate: true,
        colour: categoryColor
    }, (block) => {
        const code = `ExtForge.Utils.lists_foreach.index[ExtForge.Utils.lists_foreach.index.length] ?? 0`
        return [`${code}`, 0];
    })
    registerBlock(`${categoryPrefix}foreachvalue`, {
        message0: 'value',
        args0: [],
        output: null,
        inputsInline: true,
        canDragDuplicate: true,
        colour: categoryColor
    }, (block) => {
        const code = `ExtForge.Utils.lists_foreach.value[ExtForge.Utils.lists_foreach.index.value]`
        return [`${code}`, 0];
    })

    const lists_create_mutator = {
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
            const containerBlock = workspace.newBlock(`${categoryPrefix}create_mutator_list`);
            containerBlock.initSvg();
            let connection = containerBlock.nextConnection;
            for (let i = 0; i < this.items_; i++) {
                const itemBlock = workspace.newBlock(`${categoryPrefix}create_mutator_item`);
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
                    .appendField("create empty list");
            }

            for (let i = 0; i < this.items_; i++) {
                if (!this.getInput(`ITEM${i}`)) {
                    const input = this.appendValueInput(`ITEM${i}`)
                                      .setAlign(Blockly.ALIGN_RIGHT);
                    const inputInside = this.workspace.newBlock('generic_any')
                    inputInside.setShadow(true)
                    inputInside.initSvg()
                    inputInside.render()
                    inputInside.outputConnection.connect(input.connection)
                    if (i === 0) {
                        input.appendField("create list with");
                    }
                }
            }

            for (let i = this.items_; this.getInput(`ITEM${i}`); i++) {
                this.removeInput(`ITEM${i}`);
            }
        }
    }
    registerMutator(
        `${categoryPrefix}create_mutator`,
        lists_create_mutator,
        null,
        [`${categoryPrefix}create_mutator_item`],
    );
}

export default register;