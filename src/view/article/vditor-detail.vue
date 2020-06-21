<template>
  <div class="wrapper">
    <button onclick="setTheme('dark')">Dark Mode</button>
    <button onclick="setTheme('light')">Light Mode</button>
    <div id="previewWrap">
      <div id="preview" class="preview"></div>
    </div>
    <div id="outline"></div>
  </div>
</template>

<script>
import articleApi from '../../model/article';
import { SubscribeButton } from '@/view/subscribe';
import Error404Page from '@/view/error-page/404';
import Vditor from 'vditor';

export default {
  name: 'ArticleDetail',
  data() {
    return {
      model: {
        content: ''
      }
    };
  },
  components: {},
  computed: {
    id() {
      return this.$route.params.id;
    }
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
        speech: {
          enable: true
        },
        anchor: 1,
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
        }
      });
    },
    initOutline() {
      const headingElements = [];
      Array.from(document.getElementById('preview').children).forEach(item => {
        if (
          item.tagName.length === 2 &&
          item.tagName !== 'HR' &&
          item.tagName.indexOf('H') === 0
        ) {
          headingElements.push(item);
        }
      });

      let toc = [];
      window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        toc = [];
        headingElements.forEach(item => {
          toc.push({
            id: item.id,
            offsetTop: item.offsetTop
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
    }
  }
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
  width: 186px;
  top: 117px;
  right: 20px;
  bottom: 86px;
  overflow: auto;
  font-size: 12px;
  border-left: 1px solid #eee;
  background-color: #fff;
}
#outline /deep/ {
  .vditor-outline__item {
    border-left: 1px solid transparent;
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