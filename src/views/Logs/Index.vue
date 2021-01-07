<template>
    <section>
        <div style="display: none1">
            <el-form ref="form" label-width="80px" @submit.prevent="onSubmit"
                     style="margin:20px;width:60%;min-width:600px;">
                <el-form-item label="用户名">
                    <el-input v-model="userName"></el-input>
                </el-form-item>

                <el-form-item label="密码">
                    <el-input v-model="userMessage"></el-input>
                </el-form-item>
            </el-form>
            <ul v-for="(item, index) in messages" v-bind:key="index + 'itemMessage'">
                <li><b>Name: </b>{{item.user}}</li>
                <li><b>Message: </b>{{item.message}}</li>
            </ul>
            <el-button type="primary" @click="submitCard">登录</el-button>

            <el-button type="primary" @click="getLogs">查询</el-button>
        </div>


        <el-table
                :data="tableData"
                v-loading="listLoading"
                style="width: 100%">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item label="Datetime">
                            <span>{{ props.row.datetime }}</span>
                        </el-form-item>
                        <el-form-item label="Content">
                            <span v-html="props.row.content"></span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column
                    label="Datetime"
                    prop="datetime">
            </el-table-column>
            <el-table-column
                    label="Content">
                <template scope="scope">
                    <span :class="scope.row.logColor"
                          v-html="scope.row.content"></span>
                </template>
            </el-table-column>
            <!--<el-table-column-->
                    <!--label="IP"-->
                    <!--prop="ip">-->
            <!--</el-table-column>-->
        </el-table>
    </section>
</template>

<script>
    import util from '../../../util/date'
    import {getLogs,BaseApiUrl} from '../../api/api';
    import * as signalR from "@aspnet/signalr";

    export default {
        data() {
            return {
                filters: {
                    LinkUrl: ''
                },
                listLoading: true,
                tableData: [],
                userName: "Tom",
                userMessage: "123",
                connection: "",
                messages: [],
                t: ""

            }
        },
        methods: {
            //性别显示转换
            formattdDetail: function (row, column) {
                return row.tdDetail ? row.tdDetail.substring(0, 20) : "N/A";
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
                let thisvue=this;
                let para = {
                    page: this.page,
                    key: this.filters.LinkUrl
                };
                this.listLoading = true;

                getLogs(para).then((res) => {
                    // this.tableData = res.data.response;
                    thisvue.connection.start().then(() => {

                        thisvue.connection.invoke('GetLatestCount', 1).catch(function (err) {
                            return console.error(err);
                        });

                        // transactionConnection.invoke('JoinGroup', 'ClientAccountTransaction').catch(err => console.error(err.toString()));

                    });


                });
            },
            submitCard: function () {
                if (this.userName && this.userMessage) {
                    this.connection.invoke('SendMessage', this.userName, this.userMessage).catch(function (err) {
                        return console.error(err);
                    });

                }
            },
            getLogs: function () {
                this.listLoading = true;
                this.connection.invoke('GetLatestCount', 1).catch(function (err) {
                    return console.error(err);
                });

            }

        },
        created: function () {
            let thisVue = this;

            thisVue.connection = new signalR.HubConnectionBuilder()
                .withUrl(`${BaseApiUrl}/api2/chatHub`)
                .configureLogging(signalR.LogLevel.Information)
                .build();



            thisVue.connection.on('ReceiveMessage', function (user, message) {
                thisVue.messages.push({user, message});
            });

            thisVue.connection.on('ReceiveUpdate', function (update) {
                console.info('update success!')
                thisVue.listLoading = false;
                thisVue.tableData = update;
                window.clearInterval(this.t)
            })
        },
        mounted() {
            this.getRoles();

            //  this.t =  setTimeout(() => {
            //      this.getLogs();
            // }, 1000);

        },
        beforeDestroy() {
            window.clearInterval(this.t)
            this.connection.stop();
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

    .EXC {
        color: red;
    }
</style>
