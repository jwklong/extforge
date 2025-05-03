import Blockly from "blockly/core"
const svgPaths = Blockly.utils.svgPaths

class CustomConstantProvider extends Blockly.zelos.ConstantProvider {
    constructor() {
        super()

        this.NOTCH_WIDTH = 6 * this.GRID_UNIT
        this.NOTCH_HEIGHT = 1.5 * this.GRID_UNIT
    }

    init() {
        super.init()

        this.FIELD_TEXT_FONTSIZE = 11
        this.FIELD_TEXT_FONTFAMILY = "Noto Sans"

        this.ADD_START_HATS = true
        
        this.PLUS = this.makePlus()
        this.ARROW = this.makeArrow();
    }

    /** @returns {import("blockly/core/renderers/common/constants").Shape} */
    makeArrow() {
        const maxWidth = this.MAX_DYNAMIC_CONNECTION_SHAPE_WIDTH;
        // try to get rid of the VERY noticeable gap
        function makeLeftPath(height, up) {
            const halfHeight = height / 2;
            const width = halfHeight > maxWidth ? maxWidth : halfHeight;
            const forward = up ? -1 : 1;
            const direction = 1;
            const dy = (forward * height) / 2;
            return (
                svgPaths.lineOnAxis("h", -width) +
                svgPaths.lineOnAxis("v", dy * 2)
                //svgPaths.lineTo(-width, up ? (forward * height) : 0) +
                //svgPaths.lineOnAxis("v", dy)
            );
        }
        return {
            type: this.SHAPES.HEXAGONAL,
            isDynamic: true,
            width(height) {
                const halfHeight = height / 2;
                return halfHeight > maxWidth ? maxWidth : halfHeight
            },
            height(height) {
                return height;
            },
            connectionOffsetY(connectionHeight) {
                return connectionHeight / 2;
            },
            connectionOffsetX(connectionWidth) {
                return -connectionWidth;
            },
            pathDown: (height) => makeLeftPath(height, false), //this.SQUARED.pathDown,
            pathUp: (height) => makeLeftPath(height, true), //this.SQUARED.pathUp,
            pathRightDown: this.HEXAGONAL.pathRightDown,
            pathRightUp: this.HEXAGONAL.pathRightUp
        }
    }

    /** @returns {import("blockly/core/renderers/common/constants").Shape} */
    makePlus() {
        const radius = this.CORNER_RADIUS

        function makeMainPath(
            blockHeight, up, right) {
            return (
                svgPaths.arc(
                    'a', '0 0,1', radius,
                    svgPaths.point(
                        (up ? -1 : 1) * radius, (up ? -1 : 1) * radius)
                    ) +
                svgPaths.arc(
                    'a', '0 0,0', radius,
                    svgPaths.point(
                        (up ? -1 : 1) * radius, (up ? -1 : 1) * radius)
                    ) +
                svgPaths.lineOnAxis('h', (right ? 1 : -1) * radius / 2) +
                svgPaths.arc(
                    'a', '0 0,1', radius,
                    svgPaths.point(
                        (up ? -1 : 1) * radius, (up ? -1 : 1) * radius)
                    ) +
                svgPaths.lineOnAxis('v', (right ? 1 : -1) * (blockHeight - radius * 6)) +
                svgPaths.arc(
                    'a', '0 0,1', radius,
                    svgPaths.point(
                        (up ? 1 : -1) * radius, (up ? -1 : 1) * radius)
                    ) +
                svgPaths.lineOnAxis('h', (right ? -1 : 1) * radius / 2) +
                svgPaths.arc(
                    'a', '0 0,0', radius,
                    svgPaths.point(
                        (up ? 1 : -1) * radius, (up ? -1 : 1) * radius)
                    ) +
                svgPaths.arc(
                    'a', '0 0,1', radius,
                    svgPaths.point(
                        (up ? 1 : -1) * radius, (up ? -1 : 1) * radius)
                    )
            )
        }

        return {
            type: this.SHAPES.HEXAGONAL,
            isDynamic: true,
            width(height) {
                const halfHeight = height / 2;
                const maxWidth = radius * 4;
                return halfHeight > maxWidth ? maxWidth : halfHeight;
            },
            height(height) {
                return height;
            },
            connectionOffsetY(connectionHeight) {
                return connectionHeight / 2;
            },
            connectionOffsetX(connectionWidth) {
                return -connectionWidth;
            },
            pathDown(height) {
                return makeMainPath(height, false, false);
            },
            pathUp(height) {
                return makeMainPath(height, true, false);
            },
            pathRightDown(height) {
                return makeMainPath(height, false, true);
            },
            pathRightUp(height) {
                return makeMainPath(height, false, true);
            },
        };
    }

    shapeFor(connection) {
        let checks = connection.getCheck();
        if (!checks && connection.targetConnection) {
            checks = connection.targetConnection.getCheck();
        }
        if (connection.type == Blockly.ConnectionType.INPUT_VALUE || connection.type == Blockly.ConnectionType.OUTPUT_VALUE) {
            if (checks && checks.length > 1) {
                return this.ROUNDED;
            } else if (checks && checks.includes('Sprite')) {
                return this.ARROW;
            } else if (checks && checks.includes('List')) {
                return this.PLUS;
            } else if (checks && checks.includes('String')) {
                return this.SQUARED;
            }
        }
        return super.shapeFor(connection)
    }
}

class PathObject extends Blockly.zelos.PathObject {
    updateShadow_() {}
}

class Renderer extends Blockly.zelos.Renderer {
    constructor(name) {
        super(name);
    }

    makeConstants_() {
        return new CustomConstantProvider();
    }

    makePathObject(root, style) {
        return new PathObject(root, style, this.getConstants())
    }
}

export default (Blockly) => {
    Blockly.blockRendering.unregister('custom_renderer') //weird bug
    Blockly.blockRendering.register('custom_renderer', Renderer)
};