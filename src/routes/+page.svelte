<script lang="ts">
  import Blockly from "blockly/core";

  import En from "blockly/msg/en";
  import "blockly/blocks";
  import "blockly/javascript";

  import JSZip from "jszip";
  import * as FileSaver from "file-saver";
  import fileDialog from "../resources/fileDialog";

  import * as ContinuousToolboxPlugin from "@blockly/continuous-toolbox";

  import Patches from "../patches";
  import registerCategories from "../resources/categories";

  import Toolbox from "$lib/Toolbox/Toolbox.xml?raw";

  import BlocklyComponent from "$lib/svelte-blockly";
  import { onMount } from "svelte";

  import Compiler from "../resources/compiler";

  import NavigationBar from "$lib/NavigationBar/NavigationBar.svelte";
  import NavigationButton from "$lib/NavigationBar/Button.svelte";
  import NavigationDivider from "$lib/NavigationBar/Divider.svelte";

  import NavIconSave from "$lib/images/nav/save.svg";
  import NavIconLoad from "$lib/images/nav/load.svg";
  import NavIconExperiments from "$lib/images/nav/experiments.svg";
  import NavIconDark from "$lib/images/nav/dark.svg";

  import TabManager from "$lib/TabManager/TabManager.svelte";
  import Tab from "$lib/TabManager/Tab.svelte";

  import ExperimentsModal from "$lib/Modal/ExperimentsModal.svelte";
  import CreateVariableModal from "$lib/Modal/CreateVariableModal.svelte";
  import EditBlockModal from "$lib/Modal/EditBlockModal.svelte";

  import CodePreview from "$lib/CodePreview/CodePreview.svelte";

  import PropertiesPicker from "$lib/PropertiesPicker/PropertiesPicker.svelte";
  import ExportMenu from "$lib/ExportMenu/ExportMenu.svelte";
  import BlocksMenu from "$lib/BlocksMenu/BlocksMenu.svelte";

  const en = {
    rtl: false,
    msg: {
      ...En,
    },
  };

  const config = {
    toolbox: Toolbox,
    collapse: true,
    comments: true,
    scrollbars: true,
    renderer: "custom_renderer",
    zoom: {
      controls: true,
      wheel: true,
      startScale: 0.8,
      maxScale: 2,
      minScale: 0.5,
      scaleSpeed: 1.1,
    },
    plugins: {
      toolbox: ContinuousToolboxPlugin.ContinuousToolbox,
      flyoutsVerticalToolbox: ContinuousToolboxPlugin.ContinuousFlyout,
      metricsManager: ContinuousToolboxPlugin.ContinuousMetrics,
    },
  };

  let localConfig = {
    dark: false,
  };

  function updateTheme() {
    if (localConfig.dark) {
      document.body.classList.add('dark')
    } else {
      document.body.classList.remove('dark')
    }
  }

  Patches.Blockly.ToolboxFlyout(Blockly, config);
  Patches.Blockly.Renderer(Blockly);
  Patches.Blockly.DuplicateDrag(Blockly);
  
  import registerBlocks from "../resources/blocks"
  import registerButtons from "../resources/buttons"
  registerBlocks()

  /** @type {import('blockly').Workspace} */
  let workspace;
  let compiler = new Compiler();
  let code;
  let properties = {
    name: "Extension",
    id: "extensionID",
    color: "#0fbd8c",
  };

  function updateGeneratedCode() {
    code = compiler.compile(workspace, properties);
  }

  function openModal(id) {
    window.modals[id].toggle();
  }

  function downloadProject() {
    let filteredProjectName = properties.id.replace(/[^a-z0-9\-]+/gim, "_");
    let fileName = filteredProjectName + ".exf";

    let projectData = Blockly.serialization.workspaces.save(workspace);

    projectData = {
      blockly: projectData,
      properties: properties,
      variables: window.variables || {},
      blocks: window.blocks || {}
    };

    // zip
    const zip = new JSZip();
    zip.file(
      "README.txt",
      "This file is not meant to be opened!" +
        "\nBe careful as you can permanently break your extension!",
    );

    // data
    const data = zip.folder("data");
    data.file("project.json", JSON.stringify(projectData));

    // download
    zip.generateAsync({ type: "blob" }).then((blob) => {
      FileSaver.saveAs(blob, fileName);
    });
  }

  function loadProject() {
    fileDialog({ accept: ".exf" }).then((files) => {
      if (!files) return;
      const file = files[0];

      const projectNameIdx = file.name.lastIndexOf(".exf");

      JSZip.loadAsync(file.arrayBuffer()).then(async (zip) => {
        const dataFolder = zip.folder("data");
        const projectJsonString = await dataFolder
          .file("project.json")
          .async("string");
        const projectJson = JSON.parse(projectJsonString);

        properties.name = projectJson.properties.name ?? "Extension";
        properties.id = projectJson.properties.id ?? "extensionID";
        properties.color = projectJson.properties.color ?? "#0fbd8c";

        window.variables = projectJson.variables ?? {};
        window.blocks = projectJson.blocks ?? {};

        Blockly.serialization.workspaces.load(projectJson.blockly, workspace);

        updateGeneratedCode();
      });
    });
  }

  onMount(() => {
    code = "";

    window.Blockly = Blockly;
    window.workspace = workspace;
    window.variables = {};
    window.blocks = {};

    registerCategories(workspace);
    registerButtons(workspace);

    updateTheme();

    workspace.addChangeListener(event => {
      //Blockly.Events.disableOrphans(event);
      updateGeneratedCode();
    });

    addEventListener('beforeunload', event => {
      try {
        if (workspace.getAllBlocks().length > 0) {
          event.preventDefault();
          event.returnValue = true;
        }
      } catch {}
    })

    let newconfig = localStorage.getItem('localConfig')
    if (newconfig) {
      localConfig.dark = JSON.parse(newconfig).dark ?? false
      updateTheme()
    }

    addEventListener('unload', event => {
      localStorage.setItem('localConfig', JSON.stringify(localConfig))
    })
  });
</script>

<head>
  <title>ExtForge</title>
</head>

<NavigationBar>
  <NavigationButton icon={NavIconDark} on:click={() => {
    localConfig.dark = !localConfig.dark;
    updateTheme()
  }}></NavigationButton>
  <NavigationDivider />
  <NavigationButton icon={NavIconSave} on:click={downloadProject}>
    Save
  </NavigationButton>
  <NavigationButton icon={NavIconLoad} on:click={loadProject}>
    Load
  </NavigationButton>
  <NavigationDivider />
  <NavigationButton icon={NavIconExperiments} on:click={() => openModal("experiments")}>
    Experiments
  </NavigationButton>
  <NavigationDivider />
  <NavigationButton on:click={() => window.open("https://discord.gg/NeYug9v2hq", '_blank')}>
    Discord
  </NavigationButton>
</NavigationBar>
<div id="main">
  <TabManager let:activeTab let:tabs let:handleTabClick let:registerTab>
    <Tab title="Editor" {activeTab} {tabs} {handleTabClick} {registerTab}>
      <div id="editor">
        <div class="blockly-container">
          <BlocklyComponent {config} locale={en} bind:workspace />
        </div>
        <div class="code">
          <CodePreview {code} />
        </div>
      </div>
    </Tab>
    <Tab title="Blocks" {activeTab} {tabs} {handleTabClick} {registerTab}>
      <BlocksMenu />
    </Tab>
    <Tab title="Properties" {activeTab} {tabs} {handleTabClick} {registerTab}>
      <PropertiesPicker {properties} on:update={updateGeneratedCode} />
    </Tab>
    <Tab title="Export" {activeTab} {tabs} {handleTabClick} {registerTab}>
      <ExportMenu {code} />
    </Tab>
  </TabManager>
</div>
<ExperimentsModal />
<CreateVariableModal />
<EditBlockModal />

<style>
  #main {
    padding-top: 3rem;
    height: calc(100% - 3rem);
  }

  #editor {
    display: flex;
    flex-direction: row;
    height: 100%;
  }

  .blockly-container {
    width: calc(100vw - 480px);
    height: 100%;
  }

  .code {
    width: 480px;
    height: 100%;
  }

  @media (max-width: 1280px) {
    .blockly-container {
      width: 100vw;
    }

    .code {
      display: none;
    }
  }
</style>
