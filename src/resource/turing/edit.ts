export const edit = `
<template>
    <div>
        <bm-modal
            v-if="visible"
            :title="title"
            :close-on-click-modal="false"
            width="560px"
            :visible="visible"
            @close="toggleModal"
        >
            <bm-tangram-form :model="params" ref="modalForm" label-width="10rem" :rules="rules">
                <bm-tangram-form-item
                    v-for="(item, index) in formList"
                    :prop="item.field"
                    :key="index"
                    :label="item.label"
                >
                    <bm-tangram-input
                        v-if="item.type === 'input'"
                        :placeholder="\`请输入\$\{item.label\}\`"
                        v-model="params[item.field]"
                    ></bm-tangram-input>
                </bm-tangram-form-item>
            </bm-tangram-form>
            <span slot="footer" class="dialog-footer">
                <bm-button @click="toggleModal">取 消</bm-button>
                <bm-button type="primary" @click="modalSuccess">确 定</bm-button>
            </span>
        </bm-modal>
    </div>
</template>

<script>
export default {
    name: 'EditModal',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        successFn: { // 修改成功以后的回调
            type: Function,
            default: () => {}
        },
        data: {
            type: Object,
            default: () => ({})
        },
        type: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            params: {
                name: '',
                topic: '',
                topicAppkey: '',
                topicNamespace: '',
                waybill: ''
            },
            formList: [
                {
                    field: 'name',
                    type: 'input',
                    label: '名称',
                    required: true
                },
                {
                    field: 'topic',
                    type: 'input',
                    label: '数量',
                    required: true
                },
                {
                    field: 'topicNamespace',
                    type: 'input',
                    label: '队列namespace',
                    required: true
                },
                {
                    field: 'topicAppkey',
                    type: 'input',
                    label: '队列appkey',
                    required: true
                },
                {
                    field: 'waybill',
                    type: 'input',
                    label: '队列名称',
                    required: true
                }
            ]
        }
    },
    computed: {
        rules() {
            const res = {}
            this.formList.forEach(item => {
                res[item.field] = []
                res[item.field].push({
                    required: item.required,
                    message: \`请输入\${item.label}\`,
                    trigger: 'change'
                })
            })
            return res
        },
        title() {
            return this.type === 'add' ? '新建' : '修改'
        }
    },
    watch: {
        // 打开弹窗过程中，回填form
        data: {
            handler(val) {
                const {
                    name,
                    topic,
                    topicAppkey,
                    topicNamespace,
                    waybill
                } = val
                this.params = {
                    name,
                    topic,
                    topicAppkey,
                    topicNamespace,
                    waybill
                }
            },
            immediate: true
        }
    },
    methods: {
        toggleModal() {
            this.$emit('toggleEditModal')
        },
        modalSuccess() {
            this.$refs['modalForm'].validate(async valid => {
                if (valid) {
                    const params = {
                        ...this.params
                    }
                    if (this.type === 'edit') {
                        params.id = this.data.id
                    }
                    try {
                        const url = \`\${this.PATH_PREFIX.DLBOX}\${this.API.DLBOX.INSERT_OR_UPDATE}\`
                        const { code, msg } = await this.$http.post(url, params)
                        if (code === 0) {
                            this.$message.success('操作成功')
                            this.toggleModal()
                            this.$emit('successFn')
                        } else {
                            this.$message.error(msg)
                        }
                    } catch(e) {
                        this.$message.error(e)
                    }
                } else {
                    return false
                }
            })   
        }
    }
}
</script>

<style lang="scss">
    
</style>`;