<template>
    <el-card :body-style="{ 'padding-bottom': '10px', 'padding-top': '10px' }"
        shadow="never"
        style="margin-bottom: 10px; border-radius: 8px"
        class="tag-card"
        v-loading="loading">
        <template #header>
            <div class="card-header">
                <span class="tag-title">热门标签</span>
                <router-link :to="{ path: '/tag/subscribe/all' }">
                    <el-button class="button"
                        style=""
                        text>
                        查看更多
                        <i class="el-icon-arrow-right el-icon--right"></i>
                    </el-button>
                </router-link>
            </div>
        </template>
        <el-tag v-for="tag in dataSource"
            v-bind:key="tag.id"
            :hit="false"
            effect="light"
            type="info">
            <router-link :to="{ path: '/tag/' + `${tag.id}` }"
                target="_blank">
                <div alt="黑客派"
                    class="tag-image"
                    :style="`background-image: url('${tag.thumbnail_display}');`"></div>
                {{ tag.tag_name }}
            </router-link>
        </el-tag>
    </el-card>
</template>

<script>
import tagApi from '@/model/tag'
export default {
    name: 'HotTagCard',
    data() {
        return {
            dataSource: [],
            pagination: {
                currentPage: 0,
                pageSize: 15,
                pageTotal: 0,
            },
            loading: false,
        }
    },
    async created() {
        await this.getTags()
    },
    methods: {
        async getTags() {
            this.loading = true
            let res = await tagApi
                .getTags({
                    count: this.pagination.pageSize,
                    page: this.pagination.currentPage,
                    sort: 'article_count desc',
                })
                .finally(() => {
                    this.loading = false
                })
            this.dataSource = [...res.items]
        },
    },
}
</script>

<style lang="scss" scoped>
.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.tag-title {
    padding: 0 0 0 0.5rem;
    color: #000;
    border-left: 4px solid #ec7259;
}

.tag-image {
    border-radius: 2px 2px 2px 2px;
    height: 16px;
    width: 16px;
    float: left;
    margin: 2px 3px 0 0;
    background-color: rgba(0, 0, 0, 0.02);
    background-size: cover;
    background-repeat: no-repeat;
    background-position: 50%;
}

.el-tag {
    margin-right: 10px;
    margin-bottom: 10px;

    &:hover {
        opacity: 0.8;
    }
}
</style>
