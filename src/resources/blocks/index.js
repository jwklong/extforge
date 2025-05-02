import registerGeneric from "./generic";
import registerEvents from "./events";
import registerControl from "./control";
import registerMath from "./math";
import registerStrings from "./strings";
import registerInputs from "./inputs";
import registerVariables from "./variables";
import registerLists from "./lists";
import registerSprites from "./sprites";
import registerBlocks from "./blocks";

import registerRuntime from "./runtime";
import registerScript from "./script";

export default () => {
    registerGeneric();
    registerEvents();
    registerControl();
    registerMath();
    registerStrings();
    registerInputs();
    registerVariables();
    registerLists();
    registerSprites();
    registerBlocks();

    registerRuntime();
    registerScript();
}