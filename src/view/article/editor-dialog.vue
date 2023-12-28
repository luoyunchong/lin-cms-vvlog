<template>
  <el-dialog title="发布随笔" :modal-append-to-body="false" :before-close="handleClose" v-model="dialogFormVisible"
    :close-on-click-modal="false" width="40%" :fullscreen="fullscreen">
    <div>
      <el-form label-width="100px" :rules="rules" :model="form" status-icon ref="form" @submit.native.prevent>
        <el-row>
          <el-col :lg="24">
            <el-form-item label="技术频道" prop="channel_id">
              <el-select size="default" filterable v-model="form.channel_id" :disabled="channels.length === 0"
                placeholder="请选择技术频道">
                <el-option v-for="item in channels" :key="item.id" :label="item.channel_name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="24">
            <el-form-item label="标签" prop="source">
              <el-select style="width: 100%" v-model="form.tag_ids" remote multiple filterable :loading="tagLoading"
                default-first-option placeholder="查询标签" :remote-method="remoteMethod">
                <el-option v-for="item in tags" :key="item.id" :label="item.tag_name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :lg="12">
            <el-form-item label="分类专栏" prop="classify_id">
              <el-select size="default" filterable v-model="form.classify_id" :disabled="classifys.length === 0"
                placeholder="请选择分类专栏">
                <el-option v-for="item in classifys" :key="item.id" :label="item.classify_name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="12">
            <el-form-item label="随笔类型" prop="excerpt">
              <el-select v-model="form.article_type" filterable default-first-option placeholder="请选择随笔类型">
                <el-option v-for="item in article_types" :key="Number(item.item_code)" :label="item.item_name"
                  :disabled="!item.status" :value="Number(item.item_code)"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <!-- <el-col :lg="24">
            <el-form-item label="关键字" prop="keywords">
              <el-input size="default" v-model="form.keywords" placeholder="请填写关键字"></el-input>
            </el-form-item>
          </el-col>-->
          <el-col :lg="24" v-show="form.article_type != 0">
            <el-form-item label="来源" prop="source">
              <el-input size="default" v-model="form.source" placeholder="请填写来源"></el-input>
            </el-form-item>
          </el-col>
          <el-col :lg="24">
            <el-form-item label="封面">
              <upload-imgs ref="thumbnail" :multiple="false" :value="thumbnailPreview" :max-num="1" />
            </el-form-item>
          </el-col>
          <el-col :lg="24">
            <el-form-item label="摘要" prop="excerpt">
              <el-input size="default" type="textarea" :autosize="{ minRows: 4, maxRows: 8 }" placeholder="请输入摘要"
                v-model="form.excerpt"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer" style="padding-left: 5px">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmEdit('form')" plain>发布随笔</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import UploadImgs from '@/component/base/upload-image'
import articleApi from '@/model/article'
import classifyApi from '@/model/classify'
import tagApi from '@/model/tag'
import baseApi from '@/model/base'
import channelApi from '@/model/channel'
import getDeviceState from '@/lin/plugin/devices'
export default {
  name: 'EditorDialog',
  components: { UploadImgs },
  props: {
    id: [String, Number],
    title: [String],
    content: [String],
    editor: [Number],
  },
  data() {
    return {
      dialogFormVisible: false,
      devices: '',
      form: {
        archive: '',
        comment_quantity: 0,
        editor: 0,
        excerpt: '',
        classify_id: null,
        is_new: true,
        author: '',
        keywords: '',
        nick_name: null,
        isaudit: true,
        likes_quantity: 0,
        recommend: true,
        source: '',
        thumbnail: '',
        type_code: null,
        type_name: null,
        view_hits: 0,
        article_type: 0,
      },
      thumbnailPreview: [],
      classifys: [],
      channels: [],
      tags: [],
      article_types: [],
      loading: false,
      tagLoading: false,
      rules: {
        channel_id: [{ required: true, message: '请选择技术频道', trigger: 'blur' }],
      },
    }
  },
  computed: {
    fullscreen() {
      return this.devices == 'phone' ? true : false
    }
  },
  async created() {
    this.devices = getDeviceState();
    this.classifys = await classifyApi.getClassifys()
    let res = await channelApi.getNavChannels({
      count: 20,
      page: 0,
    })
    this.channels = res.items
    this.article_types = await baseApi.getItems({
      typeCode: 'Article.Type',
    })
    let tags = await tagApi.getTags()
    this.tags = tags.items
  },
  methods: {
    handleClose(done) {
      this.dialogFormVisible = false
      done && done()
    },
    async remoteMethod(query) {
      if (query !== '') {
        this.tagLoading = true
        let tags = await tagApi.getTags({
          tagName: query,
        })
        this.tagLoading = false
        this.tags = tags.items
        let filterTags = []
        tags.items.forEach(r => {
          if (!this.tags.filter(u => u.id == r.id)) {
            filterTags.push(r)
          }
        })
        this.tags.concat(filterTags)
      } else {
        this.tags = []
      }
    },
    async show() {
      this.dialogFormVisible = true
      this.thumbnailPreview.length = 0
      // this.$refs["thumbnail"].clear();
      if (this.id != 0) {
        this.loading = true
        let res = await articleApi.getArticle(this.id).finally(() => {
          this.loading = false
        })
        this.form = res
        if (res.thumbnail) {
          this.thumbnailPreview = [{
            id: res.id,
            display: res.thumbnail_display,
            src: res.thumbnail,
            imgId: res.id,
          }]
        }
        this.tags = res.tags
      } else {
      }
    },
    async confirmEdit(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let thumbnail = await this.$refs['thumbnail'].getValue()
          if (thumbnail.length > 0) {
            this.form.thumbnail = thumbnail[0].src
          } else {
            this.form.thumbnail = ''
          }
          await this.submitForm(this.form)
          this.handleClose()
        } else {
          this.$message.error('请填写正确的信息')
        }
      })
    },
    async submitForm(formData) {
      formData.title = this.title
      formData.content = this.content
      formData.editor = this.editor
      let id = this.id
      if (this.id != 0) {
        await articleApi.editArticle(this.id, formData)
      } else {
        id = await articleApi.addArticle(formData)
      }

      // this.$emit("success", id);
      this.$message.success(`发布成功!`)
      if (this.id == 0) {
        this.$router.replace(`/p/editor/${id}`)
      } else {
        this.$router.replace(`/p/${id}`)
      }
    },
  },
}
</script>

<style>

</style>
