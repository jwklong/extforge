import gen from 'blockly/javascript';
const javascriptGenerator = gen.javascriptGenerator

const oldBlockToCode = javascriptGenerator.blockToCode 
javascriptGenerator.blockToCode = function(block, opt_thisOnly = false, opt_forceTuple = false) {
    const out = oldBlockToCode.apply(this, [block, opt_thisOnly])
    if (opt_forceTuple && !Array.isArray(out)) {
        return [out, 0]
    }
    return out
}

javascriptGenerator.valueToCode = function(block, name, order = 0) {
    // https://github.com/google/blockly/blob/develop/core/generator.ts
    const code = (() => {
        if (isNaN(order)) {
            throw TypeError('Expecting valid order from block: ' + block.type);
        }
        const targetBlock = block.getInputTargetBlock(name);
        if (!targetBlock && !block.getInput(name)) {
            throw ReferenceError(`Input "${name}" doesn't exist on "${block.type}"`);
        }
        if (!targetBlock) {
            return '';
        }
        const tuple = this.blockToCode(targetBlock, false, true);
        if (tuple === '') {
            // Disabled block.
            return '';
        }
        // Value blocks must return code and order of operations info.
        // Statement blocks must only return code.
        if (!Array.isArray(tuple)) {
            throw TypeError(
                `Expecting tuple from value block: ${targetBlock.type} See ` +
                `developers.google.com/blockly/guides/create-custom-blocks/generating-code ` +
                `for more information`,
            );
        }
        let code = tuple[0];
        const innerOrder = tuple[1];
        if (isNaN(innerOrder)) {
            throw TypeError(
                'Expecting valid order from value block: ' + targetBlock.type,
            );
        }
        if (!code) {
            return '';
        }

        // Add parentheses if needed.
        let parensNeeded = false;
        const outerOrderClass = Math.floor(order);
        const innerOrderClass = Math.floor(innerOrder);
        if (outerOrderClass <= innerOrderClass) {
            if (
                outerOrderClass === innerOrderClass &&
                (outerOrderClass === 0 || outerOrderClass === 99)
            ) {
                // Don't generate parens around NONE-NONE and ATOMIC-ATOMIC pairs.
                // 0 is the atomic order, 99 is the none order.  No parentheses needed.
                // In all known languages multiple such code blocks are not order
                // sensitive.  In fact in Python ('a' 'b') 'c' would fail.
            } else {
                // The operators outside this code are stronger than the operators
                // inside this code.  To prevent the code from being pulled apart,
                // wrap the code in parentheses.
                parensNeeded = true;
                // Check for special exceptions.
                for (let i = 0; i < this.ORDER_OVERRIDES.length; i++) {
                    if (
                        this.ORDER_OVERRIDES[i][0] === order &&
                        this.ORDER_OVERRIDES[i][1] === innerOrder
                    ) {
                        parensNeeded = false;
                        break;
                    }
                }
            }
        }
        if (parensNeeded) {
            // Technically, this should be handled on a language-by-language basis.
            // However all known (sane) languages use parentheses for grouping.
            code = '(' + code + ')';
        }
        return code;
    })()

    const input = block.getInput(name)

    let parentType = input.connection.getCheck();
    let childType = input.connection.targetConnection && input.connection.targetConnection.getCheck();

    if (parentType && Array.isArray(parentType)) parentType = parentType[0]
    if (childType && Array.isArray(childType)) childType = childType[0]
    
    if (parentType !== childType) {
        // just add the type converter here olo
        switch (parentType) {
            case 'String':
                return `String(${code})`
            case 'Number':
                return `Number(${code})`
            case 'Boolean':
                return `((value) => 
                    typeof value === 'string' && (value === 'true' || value === 'false') 
                        ? value === 'true' 
                        : Boolean(value))(${code})`
            case 'List':
                return `((value) => value && value.length ? value : [value])(${code})`
            case 'Vector':
                return `ExtForge.Vector.from(${code})`
        }
    }
    return code
}

javascriptGenerator.workspaceToCode = function(workspace) {
    javascriptGenerator.init(workspace)

    const allBlocks = workspace.getTopBlocks(true).filter(v => !v.previousConnection && !v.outputConnection);
  
    // order blocks
    const orderedBlocks = allBlocks.sort((a, b) => b.order - a.order);
  
    // generate
    let code = '';
    for (let block of orderedBlocks) {
      code += javascriptGenerator.blockToCode(block);
    }
  
    return code;
  };

export default javascriptGenerator;