<template>
    <section>
        <el-scrollbar class="default-scrollbar" wrap-class="default-scrollbar__wrap" view-class="p20-scrollbar__view">
            <el-row :gutter="20">
                <el-col :span="12" class="echarts-item">
                    <div class="content-title">柱状图</div>
                    <ve-histogram :data="histogramChartData" :settings="histogramChartSettings" :mark-line="histogramChartMarkLine"></ve-histogram>
                </el-col>
                <el-col :span="12" class="echarts-item">
                    <div class="content-title">折线图</div>
                    <ve-line :data="lineChartData" :settings="lineChartSettings" :mark-point="lineChartMarkPoint"></ve-line>
                </el-col>
                <el-col :span="12" class="echarts-item">
                    <div class="content-title">饼图</div>
                    <ve-pie :data="pieChartData" :settings="pieChartSettings"></ve-pie>
                </el-col>
                <el-col :span="12" class="echarts-item">
                    <div class="content-title">环形图</div>
                    <ve-ring :data="ringChartData" :settings="ringChartSettings"></ve-ring>
                </el-col>
            </el-row>
        </el-scrollbar>
    </section>
</template>

<script>
    import Vue from 'vue'
    import VCharts from 'v-charts'
    Vue.use(VCharts)
    export default {
        name: 'AdminDashboard',
        data () {
            return {
                histogramChartData: {
                    columns: ['日期', '直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎', '百度', '谷歌', '必应', '其他'],
                    rows: [{
                        '日期': '周一', '直接访问': 320, '邮件营销': 120, '联盟广告': 220, '视频广告': 150, '搜索引擎': 862, '百度': 620, '谷歌': 120, '必应': 60, '其他': 62
                    }, {
                        '日期': '周二', '直接访问': 332, '邮件营销': 132, '联盟广告': 182, '视频广告': 232, '搜索引擎': 1018, '百度': 732, '谷歌': 132, '必应': 72, '其他': 82
                    }, {
                        '日期': '周三', '直接访问': 301, '邮件营销': 101, '联盟广告': 191, '视频广告': 201, '搜索引擎': 964, '百度': 701, '谷歌': 101, '必应': 71, '其他': 91
                    }, {
                        '日期': '周四', '直接访问': 334, '邮件营销': 134, '联盟广告': 234, '视频广告': 154, '搜索引擎': 1026, '百度': 734, '谷歌': 134, '必应': 74, '其他': 84
                    }, {
                        '日期': '周五', '直接访问': 390, '邮件营销': 90, '联盟广告': 290, '视频广告': 190, '搜索引擎': 1679, '百度': 1090, '谷歌': 290, '必应': 190, '其他': 109
                    }, {
                        '日期': '周六', '直接访问': 330, '邮件营销': 230, '联盟广告': 330, '视频广告': 330, '搜索引擎': 1600, '百度': 1130, '谷歌': 230, '必应': 130, '其他': 110
                    }, {
                        '日期': '周日', '直接访问': 320, '邮件营销': 210, '联盟广告': 310, '视频广告': 410, '搜索引擎': 1570, '百度': 1120, '谷歌': 220, '必应': 110, '其他': 120
                    }]
                },
                histogramChartSettings: {
                    metrics: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎', '百度', '谷歌', '必应', '其他'],
                    dimension: ['日期'],
                    stack: {
                        '广告': ['邮件营销', '联盟广告', '视频广告'],
                        '搜索引擎': ['百度', '谷歌', '必应', '其他']
                    }
                },
                histogramChartMarkLine: {
                    data: [
                        [{type: 'min'}, {type: 'max'}]
                    ]
                },
                lineChartData: {
                    columns: ['日期', '成本', '利润', '占比', '其他'],
                    rows: [{
                        '成本': 1523, '日期': '1月1日', '利润': 1523, '占比': 0.12, '其他': 100
                    }, {
                        '成本': 1223, '日期': '1月2日', '利润': 1523, '占比': 0.345, '其他': 100
                    }, {
                        '成本': 2123, '日期': '1月3日', '利润': 1523, '占比': 0.7, '其他': 100
                    }, {
                        '成本': 4123, '日期': '1月4日', '利润': 1523, '占比': 0.31, '其他': 100
                    }, {
                        '成本': 3123, '日期': '1月5日', '利润': 1523, '占比': 0.12, '其他': 100
                    }, {
                        '成本': 7123, '日期': '1月6日', '利润': 1523, '占比': 0.65, '其他': 100
                    }]
                },
                lineChartSettings: {
                    metrics: ['成本', '利润'],
                    dimension: ['日期']
                },
                lineChartMarkPoint: {
                    data: [{
                        name: '最大值',
                        type: 'max'
                    }]
                },
                pieChartData: {
                    columns: ['日期', '成本', '利润'],
                    rows: [{
                        '日期': '1月1号', '成本': 123, '利润': 3
                    }, {
                        '日期': '1月2号', '成本': 1223, '利润': 6
                    }, {
                        '日期': '1月3号', '成本': 2123, '利润': 90
                    }, {
                        '日期': '1月4号', '成本': 4123, '利润': 12
                    }, {
                        '日期': '1月5号', '成本': 3123, '利润': 15
                    }, {
                        '日期': '1月6号', '成本': 7123, '利润': 20
                    }]
                },
                pieChartSettings: {
                    dimension: '成本',
                    metrics: '利润'
                },
                ringChartData: {
                    columns: ['日期', '成本', '利润'],
                    rows: [{
                        '日期': '1月1号', '成本': 123, '利润': 3
                    }, {
                        '日期': '1月2号', '成本': 1223, '利润': 6
                    }, {
                        '日期': '1月3号', '成本': 2123, '利润': 90
                    }, {
                        '日期': '1月4号', '成本': 4123, '利润': 12
                    }, {
                        '日期': '1月5号', '成本': 3123, '利润': 15
                    }, {
                        '日期': '1月6号', '成本': 7123, '利润': 20
                    }]
                },
                ringChartSettings: {
                    dimension: '成本',
                    metrics: '利润'
                }
            }
        },
        created: function () {
        },
        methods: {
        }
    }
</script>

<style scoped>
    .content-title{
        clear: both;
        font-weight: 400;
        line-height: 50px;
        padding: 10px 10px;
        font-size: 22px;
        color: #1f2f3d;
    }
</style>
