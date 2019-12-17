<template>
  <div v-loading="loading">
    <sticky-top>
      <div class="title">
        <span>{{title[this.id==0?0:1]}}</span>
        <span class="back" @click="back">
          <i class="iconfont icon-fanhui"></i> 返回
        </span>
      </div>
    </sticky-top>
    <div class="container">
      <div class="wrap">
        <el-row>
          <el-col :lg="24" :md="24" :sm="24" :xs="24">
            <el-form
              :rules="rules"
              :model="form"
              status-icon
              ref="form"
              label-width="100px"
              @submit.native.prevent
            >
              <el-row>
                <el-col :lg="12">
                  <el-form-item label="标题" prop="title">
                    <el-input size="medium" v-model="form.title" placeholder="请填写标题"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :lg="12">
                  <el-form-item label prop="title">
                    <el-link
                      type="primary"
                      :href="'/post/'+form.id"
                      v-if="form.id!=null"
                      target="_blank"
                    >查看随笔</el-link>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :lg="6">
                  <el-form-item label="分类专栏" prop="classify_id">
                    <el-select
                      size="medium"
                      filterable
                      v-model="form.classify_id"
                      :disabled="classifys.length === 0"
                      placeholder="请选择分类专栏"
                    >
                      <el-option
                        v-for="item in classifys"
                        :key="item.id"
                        :label="item.classify_name"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :lg="6">
                  <el-form-item label="随笔类型" prop="excerpt">
                    <el-select
                      v-model="form.article_type"
                      filterable
                      default-first-option
                      placeholder="请选择随笔类型"
                    >
                      <el-option
                        v-for="item in article_types"
                        :key="Number(item.item_code)"
                        :label="item.item_name"
                        :value="Number(item.item_code)"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :lg="12">
                  <el-form-item label="标签" prop="source">
                    <el-select
                      style="width:100%;"
                      v-model="form.tag_ids"
                      remote
                      multiple
                      filterable
                      :loading="tagLoading"
                      default-first-option
                      placeholder="添加一个标签"
                      :remote-method="remoteMethod"
                    >
                      <el-option
                        v-for="item in tags"
                        :key="item.id"
                        :label="item.tag_name"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :lg="12">
                  <el-form-item label="关键字" prop="keywords">
                    <el-input size="medium" v-model="form.keywords" placeholder="请填写关键字"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :lg="12">
                  <el-form-item label="来源" prop="source">
                    <el-input size="medium" v-model="form.source" placeholder="请填写来源"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :lg="12">
                  <el-form-item label="封面">
                    <upload-imgs
                      ref="thumbnail"
                      :multiple="false"
                      :value="thumbnailPreview"
                      :max-num="1"
                    />
                  </el-form-item>
                </el-col>
                <el-col :lg="12">
                  <el-form-item label="摘要" prop="excerpt">
                    <el-input
                      size="medium"
                      type="textarea"
                      :autosize="{ minRows: 4, maxRows: 8}"
                      placeholder="请输入摘要"
                      v-model="form.excerpt"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :lg="24">
                  <mavon-editor v-model="form.content" />
                </el-col>
              </el-row>
              <el-form-item class="submit">
                <el-button type="primary" @click="confirmEdit('form')">保 存</el-button>
                <el-button @click="resetForm('form')">重 置</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";
import UploadImgs from "@/components/base/upload-imgs";
import articleApi from "../../models/article";
import classifyApi from "../../models/classify";
import tagApi from "../../models/tag";
import baseApi from "@/plugins/Blog/models/base";

export default {
  name: "ArticleForm",
  data() {
    return {
      title: ["添加随笔", "编辑随笔"],
      id: 0,
      form: {
        archive: "",
        comment_quantity: 0,
        content: "",
        editor: 0,
        excerpt: "",
        classify_id: null,
        is_audit: true,
        is_new: true,
        is_stickie: true,
        author: "",
        keywords: "",
        nick_name: null,
        likes_quantity: 0,
        recommend: true,
        source: "",
        thumbnail: "",
        title: "",
        type_code: null,
        type_name: null,
        view_hits: 0,
        article_type: 0
      },
      thumbnailPreview: [],
      classifys: [],
      tags: [],
      article_types: [],
      loading: false,
      tagLoading: false,
      rules: {
        // 表单验证规则
        title: [{ required: true, message: "请输入标题", trigger: "blur" }]
      }
    };
  },
  props: {},
  components: {
    mavonEditor,
    UploadImgs
  },
  async mounted() {},
  async created() {
    this.classifys = await classifyApi.getClassifys();
    this.article_types = await baseApi.getItems({
      typeCode: "Article.Type"
    });
    let tags = await tagApi.getTags();
    this.tags = tags.items;
  },
  // watch: {
  //   $route(to, from) {
  //     this.setForm();
  //   }
  // },
  // computed: {
  //   id() {
  //     return this.$route.query.id;
  //   }
  // },
  methods: {
    async remoteMethod(query) {
      if (query !== "") {
        this.tagLoading = true;
        let tags = await tagApi.getTags({
          tagName: query
        });
        this.tagLoading = false;
        this.tags = tags.items;
        let filterTags = [];
        tags.items.forEach(r => {
          if (!this.tags.filter(u => u.id == r.id)) {
            filterTags.push(r);
          }
        });
        this.tags.concat(filterTags);
      } else {
        this.tags = [];
      }
    },
    async show(id) {
      this.id = id;
      if (this.id) {
        this.loading = true;
        let res = await articleApi.getArticle(this.id).finally(() => {
          this.loading = false;
        });
        this.form = res;
        this.thumbnailPreview.length = 0;
        if (res.thumbnail) {
          this.thumbnailPreview.push({
            id: res.id,
            display: res.thumbnail_display,
            src: res.thumbnail,
            imgId: res.id
          });
        }
        this.tags = res.tags;
      } else {
        this.resetForm("form");
      }
    },
    async submitForm() {
      if (this.id) {
        return await articleApi.editArticle(this.id, this.form);
      } else {
        return await articleApi.addArticle(this.form);
      }
    },
    async confirmEdit(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          var thumbnail = await this.$refs["thumbnail"].getValue();
          if (thumbnail.length > 0) {
            this.form.thumbnail = thumbnail[0].src;
          } else {
            this.form.thumbnail = "";
          }
          const res = await this.submitForm();
          if (res.error_code === 0) {
            this.$message.success(`${res.msg}`);
            this.$emit("editClose");
          }
        } else {
          this.$message.error("请填写正确的信息");
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.form.content = "";
      this.$refs["thumbnail"].clear();
    },
    back() {
      this.$emit("editClose");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/form.scss";
</style>
