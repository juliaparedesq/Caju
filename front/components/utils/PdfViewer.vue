<template>
  <v-card class="elevation-0">
    <div class="iframeContainer"></div>
  </v-card>
</template>

<script>
  import pdfMake from "pdfmake/build/pdfmake";
  import pdfFonts from "pdfmake/build/vfs_fonts";

  pdfMake.vfs = pdfFonts.pdfMake.vfs;

  export default {
    name: "PdfViewer",
    props: {
      content: Object
    },
    mounted(){
      this.generate();
    },
    methods: {
      generate() {
        if(this.content == null)
          return;
        const pdfDocGenerator = pdfMake.createPdf(this.content);
        pdfDocGenerator.getDataUrl((dataUrl) => {
          const targetElement = document.querySelector('div.iframeContainer');
          while(targetElement.firstChild){
            targetElement.firstChild.remove();
          }
          const iframe = document.createElement('iframe');
          iframe.src = dataUrl;
          targetElement.appendChild(iframe);
        });
      }
    },
    watch: {
      content(){
        this.generate();
      }
    }
  }
</script>

<style>
  .iframeContainer iframe{
    width: 100%;
    height: calc( 100vh - 180px );
  }
</style>
