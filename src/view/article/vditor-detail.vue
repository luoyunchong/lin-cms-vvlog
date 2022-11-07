<template>
  <div class="wrapper">
    <div id="previewWrap">
      <div id="preview" class="preview"></div>
    </div>
    <div id="outline"></div>
  </div>
</template>

<script>
import articleApi from '../../model/article';
import Vditor from 'vditor';

export default {
  name: 'VditorDetail',
  data() {
    return {
      model: {
        title:'',
        editor:1,
        content: '',
      },
    };
  },
  components: {},
  computed: {
    id() {
      return this.$route.params.id;
    },
  },
  async mounted() {
    await this.getData();
  },
  methods: {
    async getData() {
      this.model = await articleApi.getArticle(this.id);
      this.render(this.model.content);
    },
    render(markdown) {
      var that = this;
      Vditor.preview(document.getElementById('preview'), markdown, {
        markdown: {
          toc: true,
          theme: 'light',
          // linkBase: `#/post/${that.id}`
        },
        hljs: {
          enable: true,
          style: 'tango',
          lineNumber: true,
        },
        speech: {
          enable: true,
        },
        anchor: 1,
        lazyLoadImage: 'https://cdn.jsdelivr.net/npm/vditor/dist/images/img-loading.svg',
        after() {
          if (window.innerWidth <= 768) {
            return;
          }
          const outlineElement = document.getElementById('outline');
          Vditor.outlineRender(
            document.getElementById('preview'),
            outlineElement
          );
          if (outlineElement.innerText.trim() !== '') {
            outlineElement.style.display = 'block';
            that.initOutline();
          }
        },
        renderers: {
          renderHeading: (node, entering) => {
            //https://hacpai.com/article/1588412297062
            const id = Lute.GetHeadingID(node);
            if (entering) {
              return [
                `<h${node.__internal_object__.HeadingLevel} id="${id}" class="vditor__heading">
<span class="prefix"></span><span>`,
                Lute.WalkContinue,
              ];
            } else {
              return [
                `</span><a id="vditorAnchor-${id}" class="vditor-anchor" href="#${id}"><svg viewBox="0 0 16 16" version="1.1" width="16" height="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a></h${node.__internal_object__.HeadingLevel}>`,
                Lute.WalkContinue,
              ];
            }
          },
        },
      });
    },
    initOutline() {
      const headingElements = [];
      Array.from(document.getElementById('preview').children).forEach(
        (item) => {
          if (
            item.tagName.length === 2 &&
            item.tagName !== 'HR' &&
            item.tagName.indexOf('H') === 0
          ) {
            headingElements.push(item);
          }
        }
      );

      let toc = [];
      window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        toc = [];
        headingElements.forEach((item) => {
          toc.push({
            id: item.id,
            offsetTop: item.offsetTop,
          });
        });

        const currentElement = document.querySelector(
          '.vditor-outline__item--current'
        );
        for (let i = 0, iMax = toc.length; i < iMax; i++) {
          if (scrollTop < toc[i].offsetTop - 30) {
            if (currentElement) {
              currentElement.classList.remove('vditor-outline__item--current');
            }
            let index = i > 0 ? i - 1 : 0;
            document
              .querySelector('div[data-id="' + toc[index].id + '"]')
              .classList.add('vditor-outline__item--current');
            break;
          }
        }
      });
    },
  },
};
</script>

<style  lang="scss" scoped>
@import '~vditor/dist/index.css';

.header {
  background-color: #fff;
  box-shadow: rgba(0, 0, 0, 0.05) 0 1px 7px;
  border-bottom: 1px solid #e1e4e8;
}

.wrapper {
  margin: 0 auto;
  max-width: 768px;
}

#outline {
  display: none;
  position: fixed;
  width: 250px;
  top: 70px;
  right: 20px;
  bottom: 86px;
  overflow: auto;
  font-size: 12px;
  border-left: 1px solid #eee;
  background-color: #fff;
}

#outline :deep {
  .vditor-outline__item {
    border-left: 1px solid transparent;
    padding: 10px 0px;
  }

  .vditor-outline__item--current {
    border-left: 1px solid #4285f4;
    color: #4285f4;
    background-color: #f6f8fa;
  }

  .vditor-outline__item:hover {
    color: #4285f4;
    background-color: #f6f8fa;
  }
}

@media (max-width: 768px) {
  #outline {
    display: none !important;
  }
}
</style>
