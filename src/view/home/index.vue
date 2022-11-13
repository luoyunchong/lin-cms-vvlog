<template>
    <div>
        <el-row class="row-bg" :gutter="20">
            <el-col :span="24">
                <el-card :body-style="{ padding: '15px', 'overflow-x': 'auto' }" shadow="never"
                    style="margin-bottom: 10px; border-radius: 8px">
                    <ul class="nav-list">
                        <li v-for="(item, index) in channels" v-bind:key="index" class="nav-item">
                            <router-link
                                :class="['el-link is-underline', channel == item.channel_code ? 'el-link--primary' : '']"
                                :to="{ path: `/index/${item.channel_code}` }">{{ item.channel_name }}</router-link>
                        </li>
                    </ul>
                </el-card>
            </el-col>
            <el-col :span="24" class="margin-bottom-xs">
                <div v-for="(item, index) in channels" v-bind:key="index">
                    <el-tag :hit="false" class="margin-left-xs margin-bottom-xs" v-if="item.channel_code == channel"
                        :effect="channel != undefined && tag_name == undefined ? 'dark' : 'plain'">
                        <router-link :to="{ path: `/index/${encodeURIComponent(item.channel_code)}` }">全部</router-link>
                    </el-tag>
                    <template v-for="tag in item.tags">
                        <el-tag :hit="false" :effect="tag_name == tag.tag_name ? 'dark' : 'plain'" v-bind:key="tag.id"
                            v-if="item.channel_code == channel" class="margin-left-xs">
                            <router-link :to="{
                              path: `/index/${item.channel_code}/${encodeURIComponent(tag.tag_name)}`,
                            }">{{ tag.tag_name }}</router-link>
                        </el-tag>
                    </template>
                </div>
            </el-col>
            <el-col :xs="24" :md="17">
                <el-card :body-style="{ 'padding-bottom': '10px', 'padding-top': '10px' }" shadow="never"
                    style="margin-bottom: 10px; border-radius: 8px">
                    <el-row>
                        <el-col :span="24">
                            <router-link :to="{ path: latestArticle, query: { sort: 'CreateTime' } }"
                                :class="['el-link is-underline', sort == 'CreateTime' ? 'el-link--primary' : 'el-link--info']">
                                最新
                            </router-link>
                            <el-divider direction="vertical"></el-divider>
                            <router-link :to="{ path: threeDaysHottest, query: { sort: 'THREE_DAYS_HOTTEST' } }"
                                :class="['el-link is-underline', 'el-link--' + hotType]">热榜</router-link>
                            <el-select v-model="sort" size="small" @change="onChange" style="width: 100px"
                                v-show="sort && sort != 'CreateTime'" class="margin-left-xs">
                                <el-option label="3天内" value="THREE_DAYS_HOTTEST"></el-option>
                                <el-option label="7天内" value="WEEKLY_HOTTEST"></el-option>
                                <el-option label="30天内" value="MONTHLY_HOTTEST"></el-option>
                                <el-option label="全部" value="HOTTEST"></el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                </el-card>
                <div>
                    <article-list :dataSource="dataSource"></article-list>

                    <infinite-loading @infinite="infiniteHandler" :identifier="any" distance="50">
                        <template #spinner>
                            <el-divider class="lin-divider">加载中...</el-divider>
                        </template>
                        <template #complete>
                            <el-divider class="lin-divider">我也是有底线的...</el-divider>
                        </template>
                    </infinite-loading>
                </div>
                <el-backtop class="lin-back-top"></el-backtop>
            </el-col>
            <el-col :xs="24" :md="7" class="sidebar">
                <div class="sidebar-block">
                    <el-card :body-style="{ 'padding-bottom': '10px', 'padding-top': '10px' }" shadow="never"
                        class="lin-card">
                        <template #header>
                            <div class="card-header">
                                <span class="lin-title">分享你的创作</span>
                            </div>
                        </template>
                        <div>
                            <router-link :to="{ path: `/p/editor/0` }">
                                <el-button type="primary" plain>
                                    <el-icon class="el-icon--left">
                                        <Edit />
                                    </el-icon>
                                    写随笔
                                </el-button>
                            </router-link>
                        </div>
                    </el-card>
                    <hot-tag-card></hot-tag-card>
                    <novices-card></novices-card>

                    <el-card :body-style="{ 'padding-bottom': '10px', 'padding-top': '10px' }" shadow="never"
                        class="lin-card">
                        <template #header>
                            <div class="card-header">
                                <span class="lin-title">开源</span>
                            </div>
                        </template>
                        <div>
                            <div class="margin-bottom-xs">
                                <a href="https://github.com/luoyunchong/lin-cms-dotnetcore" target="_blank">
                                    <el-button type="danger" plain>
                                        后端
                                        <!-- <el-icon> </el-icon> -->
                                        lin-cms-dotnetcore
                                    </el-button>
                                </a>
                            </div>
                            <div class="margin-bottom-xs">
                                <a href="https://github.com/luoyunchong/lin-cms-vue" target="_blank">
                                    <el-button type="primary" plain>用户UI：lin-cms-vue</el-button>
                                </a>
                            </div>
                            <div class="margin-bottom-xs">
                                <a href="https://github.com/luoyunchong/lin-cms-vvlog" target="_blank">
                                    <el-button type="success" plain>后台管理：lin-cms-vvlog</el-button>
                                </a>
                            </div>
                        </div>
                    </el-card>
                    <el-card :body-style="{ 'padding-bottom': '10px', 'padding-top': '10px' }" shadow="never"
                        class="lin-card">
                        <template #header>
                            <div class="card-header">
                                <span class="lin-title">服务器配置</span>
                            </div>
                        </template>
                        <div>
                            <ul class="server-info">
                                <li>已运行：{{ serverInfo.working_time }}</li>
                                <li>环境：{{ serverInfo.environment_name }}</li>
                                <li>OS:{{ serverInfo.version_string }}</li>
                                <li>OS_架构：{{ serverInfo.os_architecture }}</li>
                                <li>内存占用：{{ serverInfo.memory_footprint }}</li>
                                <li>CPU时间：{{ serverInfo.used_cpu_time }}</li>
                                <li>机器名称：{{ serverInfo.machine_name }}</li>
                                <li>运行用户：{{ serverInfo.user_name }}</li>
                                <li>Powered by ：{{ serverInfo.framework_description }}</li>
                            </ul>
                        </div>
                    </el-card>

                    <el-card :body-style="{ 'padding-bottom': '10px', 'padding-top': '10px' }" shadow="never"
                        class="lin-card">
                        <template #header>
                            <div class="card-header">
                                <span class="lin-title">社区</span>
                            </div>
                        </template>
                        <div class="community">
                            <el-image fit="cover" :src="wechaturl" @click="handlePreview"></el-image>
                            <el-image fit="cover" :src="url" @click="handlePreview"></el-image>
                        </div>
                    </el-card>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import ArticleList from '@/view/article/article-list'
import InfiniteLoading from 'v3-infinite-loading'
import 'v3-infinite-loading/lib/style.css'
import articleApi from '@/model/article'
import channelApi from '@/model/channel'
import monitorApi from '@/model/monitor'
import HotTagCard from '@/view/tag/hot-tag-card'
import NovicesCard from '@/view/home/novices-card'
import PreviewImage from '@/lin/plugin/preview'

export default {
    name: 'HomeIndex',
    components: { ArticleList, InfiniteLoading, HotTagCard, NovicesCard },
    data() {
        return {
            count: 20,
            dataSource: [],
            pagination: {
                currentPage: 0,
                pageSize: 10,
                pageTotal: 0,
                channel_id: null,
                tag_id: null,
            },
            loading: false,
            any: new Date(),
            channels: [],
            users: [],
            serverInfo: {},
            url: 'https://pic.downk.cc/item/5eef6f3114195aa59494de99.jpg',
            wechaturl: 'https://pic.downk.cc/item/5eef6d4e14195aa594925b91.jpg',
        }
    },
    async created() { },
    async mounted() {
        this.serverInfo = await monitorApi.getServerInfo()
    },
    computed: {
        sort() {
            return this.$route.query.sort
        },
        hotType() {
            let sortArray = ['THREE_DAYS_HOTTEST', 'WEEKLY_HOTTEST', 'MONTHLY_HOTTEST', 'HOTTEST']
            let that = this
            let hot = sortArray.filter(r => {
                return r == this.$route.query.sort
            })

            if (hot.length > 0) {
                return 'primary'
            } else {
                return 'info'
            }
        },
        channel() {
            return this.$route.params.channel
        },
        tag_name() {
            return this.$route.params.tag_name
        },
        latestArticle() {
            return this.getSortUrl('CreateTime')
        },
        threeDaysHottest() {
            return this.getSortUrl('THREE_DAYS_HOTTEST')
        },
    },
    watch: {
        $route(v) {
            this.dataSource = []
            this.pagination.currentPage = 0
            this.any = new Date()
        },
    },
    methods: {
        handlePreview($event) {
            PreviewImage({
                images: [$event.target.currentSrc],
            })
        },
        setPaginationParams() {
            //看起来很复杂，其实就是根据channels，得到选中的channelId值（技术频道），从channel.tags中找到对应的tagid（标签Id）值。
            if (this.channel != undefined) {
                this.channels &&
                    this.channels.forEach(element => {
                        if (this.channel == element.channel_code) {
                            this.pagination.channel_id = element.id
                            if (this.tag_name != undefined) {
                                element.tags.forEach(tag => {
                                    if (tag.tag_name == this.tag_name) {
                                        this.pagination.tag_id = tag.id
                                        return false
                                    }
                                })
                            } else {
                                this.pagination.tag_id = null
                            }
                            return false
                        }
                    })
            } else {
                this.pagination.channel_id = null
            }
        },
        async infiniteHandler($state) {
            console.log('infiniteHandler')
            this.loading = true
            await this.getNavChannels()
            this.setPaginationParams()
            let res
            const currentPage = this.pagination.currentPage
            res = await articleApi.getQueryArticles({
                count: this.pagination.pageSize,
                page: currentPage,
                sort: this.sort,
                channel_id: this.pagination.channel_id,
                tag_id: this.pagination.tag_id,
            })
            let items = [...res.items]

            if (items.length == 0) {
                if (currentPage == 0) {
                    this.dataSource = items
                }
                console.log('state.complete')
                $state && $state.complete()
            } else {
                if (currentPage == 0) {
                    this.dataSource = items
                } else {
                    this.dataSource = this.dataSource.concat(items)
                }
                this.pagination.currentPage += 1
                this.pagination.pageTotal = res.total

                $state && $state.loaded()
            }
            this.loading = false
        },
        getSortUrl() {
            let url = ''
            if (this.channel && this.tag_name) {
                url = `/index/${this.channel}/${this.tag_name}`
            } else if (this.channel) {
                url = `/index/${this.channel}`
            } else {
                url = `/index`
            }
            return url
        },
        onChange(val) {
            this.sort = val
            this.$router.push({ path: this.getSortUrl(), query: { sort: val } })
        },
        async getNavChannels() {
            if (this.channels.length > 0) return
            let res = await channelApi.getNavChannels({
                count: 20,
                page: 0,
            })
            this.channels = res.items
        },
    },
}
</script>

<style scoped lang="scss">
.el-form-item {
    margin-bottom: 0px !important;
}

.nav-list {
    height: 100%;
    margin: auto;
    display: flex;
    align-items: center;
    line-height: 1;

    .nav-item {
        height: 100%;
        align-items: center;
        display: flex;
        flex-shrink: 0;
        font-size: 1.16rem;
        color: #71777c;
        padding: 0 0.5rem;
    }
}

.lin-card {
    margin-bottom: 10px;
    border-radius: 8px;

    .lin-title {
        margin-bottom: 1rem;
        padding: 0 0 0 0.5rem;
        color: #000;
        border-left: 4px solid #ec7259;
    }
}

ul.server-info {
    li {
        margin-bottom: 14px;
        font-size: 14px;
    }
}

@media (max-width: 980px) {
    .nav-list {
        max-width: 960px;
        width: auto;
    }
}
</style>
