unlayer.init({
    id: 'editor',
    projectId: 1,
    displayMode: 'email',
    locale: 'es-ES',
    editor: {
      autoSelectOnDrop: true
    },
    appearance:  {
      loader: {
      url: 'https://www.radarsystems.net:8080/image/apple-touch-icon.png',
    },
      theme: 'dark',
      panels: {
          tools: {
              dock: 'left',
              collapsible: true,
          }
      }
    },
    user: {
        id: 1,
        name: 'Marlon Villamizar',
        email: 'evilslash95@gmail.com'
    },
})


unlayer.loadDesign({"counters":{"u_column":1,"u_row":1},"body":{"rows":[{"cells":[1],"columns":[{"contents":[],"values":{"backgroundColor":"","padding":"0px","border":{},"_meta":{"htmlID":"u_column_1","htmlClassNames":"u_column"}}}],"values":{"displayCondition":null,"columns":false,"backgroundColor":"","columnsBackgroundColor":"","backgroundImage":{"url":"","fullWidth":true,"repeat":false,"center":true,"cover":false},"padding":"0px","hideDesktop":false,"_meta":{"htmlID":"u_row_1","htmlClassNames":"u_row"},"selectable":true,"draggable":true,"duplicatable":true,"deletable":true,"hideable":true}}],"values":{"textColor":"#000000","backgroundColor":"#e7e7e7","backgroundImage":{"url":"","fullWidth":true,"repeat":false,"center":true,"cover":false},"contentWidth":"600px","contentAlign":"center","fontFamily":{"label":"Helvetica","value":"helvetica,sans-serif","url":"","defaultFont":true},"preheaderText":"","linkStyle":{"body":true,"linkColor":"#0000ee","linkHoverColor":"#0000ee","linkUnderline":true,"linkHoverUnderline":true},"_meta":{"htmlID":"u_body","htmlClassNames":"u_body"}}},"schemaVersion":6}
);

var empty = {"counters":{"u_column":1,"u_row":1},"body":{"rows":[{"cells":[1],"columns":[{"contents":[],"values":{"backgroundColor":"","padding":"0px","border":{},"_meta":{"htmlID":"u_column_1","htmlClassNames":"u_column"}}}],"values":{"displayCondition":null,"columns":false,"backgroundColor":"","columnsBackgroundColor":"","backgroundImage":{"url":"","fullWidth":true,"repeat":false,"center":true,"cover":false},"padding":"0px","hideDesktop":false,"_meta":{"htmlID":"u_row_1","htmlClassNames":"u_row"},"selectable":true,"draggable":true,"duplicatable":true,"deletable":true,"hideable":true}}],"values":{"textColor":"#000000","backgroundColor":"#e7e7e7","backgroundImage":{"url":"","fullWidth":true,"repeat":false,"center":true,"cover":false},"contentWidth":"600px","contentAlign":"center","fontFamily":{"label":"Helvetica","value":"helvetica,sans-serif","url":"","defaultFont":true},"preheaderText":"","linkStyle":{"body":true,"linkColor":"#0000ee","linkHoverColor":"#0000ee","linkUnderline":true,"linkHoverUnderline":true},"_meta":{"htmlID":"u_body","htmlClassNames":"u_body"}}},"schemaVersion":6};

clean = () => {
  var opcion = confirm("¿Deseá borrar todo?");
  if (opcion == true) {
    unlayer.loadDesign(empty);
  } else {

  }
}

