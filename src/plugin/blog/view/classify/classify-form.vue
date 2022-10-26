<template>
  <div>
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
          <el-col :lg="16" :md="20" :sm="24" :xs="24">
            <el-form
              status-icon
              ref="form"
              label-width="120px"
              :model="form"
              label-position="labelPosition"
              :rules="rules"
              style="margin-left:-35px;margin-bottom:-35px;margin-top:15px;"
            >
              <el-form-item label="专栏名称" prop="classify_name">
                <el-input size="default" clearable v-model="form.classify_name"></el-input>
              </el-form-item>
              <el-form-item label="封面" prop="thumbnail">
                <upload-imgs
                  ref="thumbnail"
                  :multiple="false"
                  :value="thumbnailPreview"
                  :max-num="1"
                />
              </el-form-item>
              <el-form-item label="排序码" prop="sort_code">
                <el-input size="default" type="number" clearable v-model="form.sort_code"></el-input>
              </el-form-item>
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
import classifyApi from "../../model/classify";
import UploadImgs from "@/component/base/upload-image";
export default {
  name: "ClassifyForm",
  components: { UploadImgs },
  props: {
    id: {
      type: [String, Number]
    }
  },
  data() {
    return {
      title: ["新增分类专栏", "编辑分类专栏"],
      loading: false,
      form: {
        classify_name: "",
        thumbnail: "",
        sort_code: 0
      },

      thumbnailPreview: [],
      rules: {
        classify_name: [
          { required: true, message: "请输入名称", trigger: "blur" }
        ],
        thumbnail: [{ required: true, message: "请上传封面", trigger: "blur" }]
      }
    };
  },
  async mounted() {
    this.show(this.id);
  },
  methods: {
    async show(id) {
      if (id != 0) {
        let classify = await classifyApi.getClassify(id);
        this.form = classify;
        this.thumbnailPreview.length = 0;
        if (classify.thumbnail) {
          this.thumbnailPreview = [{
            id: classify.id,
            display: classify.thumbnail_display,
            src: classify.thumbnail,
            imgId: classify.id
          }]
        }
      } else {
        Object.assign(this.form, {
          classify_name: ""
        });
      }
    },
    async submitForm() {
      if (this.id === 0) {
        return await classifyApi.addClassify(this.form);
      } else {
        return await classifyApi.editClassify(this.id, this.form);
      }
    },
    async confirmEdit(formName) {
      let thumbnail = await this.$refs["thumbnail"].getValue();
      if (thumbnail.length > 0) {
        this.form.thumbnail = thumbnail[0].src;
      } else {
        this.form.thumbnail = "";
      }

      this.$refs[formName].validate(async valid => {
        if (valid) {
          let res;
          this.loading = true;

          res = await this.submitForm().finally(() => {
            this.loading = false;
          });

          this.$message.success(`${res.message}`);
          this.$emit("editClose");
        } else {
          this.$message.error("请填写正确的信息");
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    back() {
      this.$emit("editClose");
    }
  },
  async created() {}
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/form";
</style>
