<template>
	<el-form ref="editForm" :model="editForm" label-width="80px" @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
		<el-form-item label="我的昵称">
			<el-input v-model="editForm.uRealName"></el-input>
		</el-form-item>

		<el-form-item label="旧密码" prop="uLoginPWD">
			<el-input v-model="editForm.uLoginPWD" type="text"  auto-complete="off"></el-input>
		</el-form-item>
		<el-form-item label="新密码" prop="uLoginPWD">
			<el-input v-model="editForm.uLoginPWD" show-password  auto-complete="off"></el-input>
		</el-form-item>
		<el-form-item label="确认密码" prop="uLoginPWD">
			<el-input v-model="editForm.uLoginPWD" show-password  auto-complete="off"></el-input>
		</el-form-item>

		<el-form-item label="留言/备注">
			<el-input type="textarea" v-model="editForm.desc"></el-input>
		</el-form-item>
		<el-form-item>
			<el-button @click="onSubmit" type="primary">更新</el-button>
			<el-button @click.native.prevent>取消</el-button>
		</el-form-item>
	</el-form>
</template>

<script>
	export default {
		data() {
			return {
                editForm: {
                    id: 0,
                    uID: 0,
                    RID: 0,
                    uLoginName: '',
                    uRealName: '',
                    name: '',
                    sex: -1,
                    age: 0,
                    birth: '',
                    desc: '',
                    addr: ''
                }
			}
		},
		methods: {
			onSubmit() {
                this.$message({
                    message: '失败！该操作无权限',
                    type: 'error'
                });
			}
		},
		mounted(){
            var user = JSON.parse(window.localStorage.user);
            this.editForm.uRealName=user ? user.uRealName:""
        }
	}

</script>
