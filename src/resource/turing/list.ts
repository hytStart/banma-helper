export const list = `
<template>
    <div>
        <div class="card card-content">
            <bm-tangram-form :inline="true" :model="params" label-width="6rem">
                <bm-tangram-form-item label="条件名称1">
                    <bm-tangram-input
                        placeholder="请输入"
                        v-model="params.queryWord">
                        </bm-tangram-input>
                    </bm-tangram-form-item>
            </bm-tangram-form>
            <div class="flex-end">
                <bm-button type="primary" class="mx-2" size="sm" icon="search" @click.stop="QueryData(1)">查询</bm-button>
                <bm-button type="primary" class="mx-2" size="sm" icon="plus" @click="toggleEditModal({}, 'add')">新增</bm-button>
            </div>
        </div>
        <common-table
            :loading="table.loading"
            :tableData="table.tableData"
            :columns="table.columns"
            :tableOption="table.tableOption"
            :pageInfo="table.pageInfo"
            @handlePageChange="handlePageChange"
        >
               <template slot="operate" slot-scope="{ row }">
                   <div class="operate-container">
                        <bm-button type="text" class="pub-status" @click="toggleEditModal(row, 'edit')">
                            编辑
                        </bm-button>
                        <bm-button type="text" class="pub-status" @click="handleDelete(row.id)">
                            删除
                        </bm-button>
                   </div>
                </template>
        </common-table>
        <!-- 修改弹窗 -->
        <edit-modal
            :visible="editModal.visible"
            v-if="editModal.visible"
            @toggleEditModal="toggleEditModal"
            @successFn="QueryData"
            :data="editModal.data"
            :type="editModal.type"
        ></edit-modal>
    </div>
</template>
<script>
import CommonTable from '../../common/commonList/table.vue'
import EditModal from './edit.vue'
import { cloneDeep } from 'lodash'

export default {
    name: 'List',
    components: { CommonTable, EditModal },
    data() {
        return {
            editModal: {
                visible: false,
                data: {},
                type: ''
            },
            params: {
                queryWord: ''
            },
            table: {
                loading: false,
                tableData: [],
                columns: [
                    {
                        title: 'id',
                        field: 'id'
                    },
                    {
                        title: '名称',
                        field: 'name'
                    },
                    {
                        title: '队列名称',
                        field: 'waybill'
                    },
                    {
                        title: '数量',
                        field: 'topic'
                    },
                    {
                        title: '状态',
                        field: 'statusDesc'
                    },
                    {
                        title: '操作',
                        field: 'operate',
                        width: '80',
                        slot: true
                    }
                ],
                tableOption: {},
                pageInfo: {
                    pageNum: 1,
                    pageSize: 10,
                    total: 0
                }   
            }
        }
    },
    created() {
        this.QueryData(1)
    },
    methods: {
        // 新建or修改
        toggleEditModal(row = {}, type = '') {
            this.editModal.visible = !this.editModal.visible
            this.editModal.type = type
            this.editModal.data = cloneDeep(row)
        },
        QueryData(pageNum = this.table.pageInfo.pageNum) {
            const { pageSize } = this.table.pageInfo
            const params = {
                ...this.params,
                pageNum, pageSize
            }
            this.table.pageInfo.pageNum = pageNum
            this.table.loading = true
            const url = \`\${this.PATH_PREFIX.DLBOX}\${this.API.DLBOX.GET_SHARD_PAGE}\`
            this.$http.get(url, { params }).then(res => {
                this.table.loading = false
                const { code, data, msg } = res || {}
                if (code === 0) {
                    const { records, total } = data
                    this.table.tableData = records || []
                    this.table.pageInfo.total = total
                } else {
                    this.$message.error(msg)
                }
            }).catch(e => {
                this.table.loading = false
                this.$message.error(e)
            })
        },
        handlePageChange({ pageNum }) {
            this.QueryData(pageNum)
        },
        // 删除
        handleDelete(id) {
            const params = {
                id
            }
            const url = \`\${this.PATH_PREFIX.DLBOX}\${this.API.DLBOX.GET_SHARD_PAGE}\`
            this.$http.post(url, params).then(res => {
                const { code, msg } = res || {}
                if (code === 0) {
                    this.$message.success('删除成功')
                    this.QueryData()
                } else {
                    this.$message.error(msg)
                }
            }).catch(e => {
                this.$message.error(e)
            })
        }
    }
}
</script>
<style lang="scss">
    .card-content {
        padding: 20px;
        background: #ffffff;
        margin-bottom: 20px;
    }
    .flex-end {
        display: flex;
        justify-content: flex-end;
    }
    .operate-container {
        display: flex;
        min-width: 200px;
    }
</style>`;