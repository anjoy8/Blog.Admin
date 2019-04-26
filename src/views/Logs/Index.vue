<template>
    <section>
    <el-table
            :data="tableData"
            v-loading="listLoading"
            style="width: 100%">
        <el-table-column type="expand">
            <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                    <el-form-item label="Datetime">
                        <span>{{ props.row.Datetime }}</span>
                    </el-form-item>
                    <el-form-item label="Content">
                        <span v-html="props.row.Content"></span>
                    </el-form-item>
                </el-form>
            </template>
        </el-table-column>
        <el-table-column
                label="Datetime"
                prop="Datetime">
        </el-table-column>
        <el-table-column
                label="Content">
            <template scope="scope">
                <span :class="scope.row.LogColor" v-html="scope.row.Content.substring(0,100)"></span>
            </template>
        </el-table-column>
        <el-table-column
                label="IP"
                prop="IP">
        </el-table-column>
    </el-table>
    </section>
</template>

<script>
    import util from '../../../util/date'
    import {getLogs} from '../../api/api';

    export default {
        data() {
            return {
                filters: {
                    LinkUrl: ''
                },
                listLoading: false,
                tableData:[]

            }
        },
        methods: {
            //性别显示转换
            formattdDetail: function (row, column) {
                return row.tdDetail? row.tdDetail.substring(0,20):"N/A";
            },
            formatCreateTime: function (row, column) {
                return (!row.tdCreatetime || row.tdCreatetime == '') ? '' : util.formatDate.format(new Date(row.tdCreatetime), 'yyyy-MM-dd');
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getRoles();
            },
            //获取用户列表
            getRoles() {
                let para = {
                    page: this.page,
                    key: this.filters.LinkUrl
                };
                this.listLoading = true;

                //NProgress.start();
                getLogs(para).then((res) => {
                    this.tableData = res.data.response;
                    this.listLoading = false;
                    //NProgress.done();
                });
            },

        },
        mounted() {
            this.getRoles();
        }
    }

</script>

<style scoped>
    .demo-table-expand {
        font-size: 0;
    }
    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 30%;
    }
    .EXC{
        color:red;
    }
</style>
