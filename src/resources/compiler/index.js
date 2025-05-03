import javascriptGenerator from '../javascriptGenerator';
import util from '../util';

const start = `
if (!Scratch.extensions.unsandboxed) {
    alert("This extension needs to be unsandboxed to run!")
    return
}

const ExtForge = {
    Broadcasts: new function() {
        this.raw_ = {};
        this.register = (name, blocks) => {
            this.raw_[name] = blocks;
        };
        this.execute = async (name) => {
            if (this.raw_[name]) {
                await this.raw_[name]();
            };
        };
    },

    Variables: new function() {
        this.raw_ = {};
        this.set = (name, value) => {
            this.raw_[name] = value;
        };
        this.get = (name) => {
            return this.raw_[name] ?? null;
        }
    },

    Utils: {
        setList: (list, index, value) => {
            list[index] = value;
            return list;
        },
        lists_foreach: {
            index: [],
            value: []
        },
        countString: (x, y) => {
            return y.length == 0 ? 0 : x.split(y).length - 1
        },
        log: (v) => (console.log(v), v),
        throw: function(err) {
            throw err;
        }
    }
}
`

class Compiler {
    /**
     * Generates JavaScript code from the provided workspace & info.
     * @param {import('blockly').Workspace} workspace 
     * @param {object} properties
     * @returns {string} Generated code.
     */
    compile(workspace, properties) {
        const code = javascriptGenerator.workspaceToCode(workspace);

        const headerCode = [
            `/*`,
            `   Created with ExtForge`,
            `   https://jwklong.github.io/extforge`,
            `*/`,
            `(async function (Scratch) {`,
            `const variables = {};`,
            ``,
            start
        ];
        const classRegistry = {
            top: [
                `class Extension {`
            ],
            extensionInfo: {},
            bottom: [
                `}`,
                ``,
                `let extension = new Extension();`,
                `// code compiled from extforge`
            ]
        }
        const footerCode = [
            `Scratch.extensions.register(extension);`,
            `})(Scratch);`
        ];

        /** turbobuilder stuff need to port over
        if (imageStates) {
            if (imageStates.icon.image) {
                // add icon uri
                const url = imageStates.icon.image;
                classRegistry.extensionInfo.blockIconURI = url;
            }
            if (imageStates.menuicon.image) {
                // add icon uri
                const url = imageStates.menuicon.image;
                classRegistry.extensionInfo.menuIconURI = url;
            }
        }**/
        classRegistry.extensionInfo.id = properties.id;
        classRegistry.extensionInfo.name = properties.name;
        classRegistry.extensionInfo.color1 = properties.color;
        classRegistry.extensionInfo.blocks = Object.entries(window.blocks ?? {}).map(([id, block]) => {
            return {
                opcode: `block_${id}`,
                text: util.blockToExtensionText(block.fields),
                blockType: block.type,
                arguments: Object.fromEntries(block.fields.filter(v => v.type !== 'label').map(v => {
                    switch (v.type) {
                        case 'string': {
                            return [v.id, {
                                type: "string"
                            }]
                        }
                        case 'number': {
                            return [v.id, {
                                type: "number"
                            }]
                        }
                        case 'boolean': {
                            return [v.id, {
                                type: "Boolean"
                            }]
                        }
                    }
                }))
            }
        })

        return [].concat(headerCode, classRegistry.top, [
            `getInfo() {`,
            `   return ${JSON.stringify(classRegistry.extensionInfo).substring(0, JSON.stringify(classRegistry.extensionInfo).length - 1)}}`,
            `}`,
        ], Object.entries(window.blocks ?? {}).map(([id, block]) => {
            let blockCode = javascriptGenerator.statementToCode(
                workspace.getTopBlocks().find(v => v.type == "blocks_define" && v.blockId_ == id),
                "BLOCKS"
            )
            return `async block_${id}(args, blockUtils) { ${blockCode} }`
        }), classRegistry.bottom, code, footerCode).join('\n');
    }
}

export default Compiler;