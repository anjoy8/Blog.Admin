<template>
	<el-form ref="form" :model="form" label-width="80px" @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
		<el-form-item label="我的昵称">
			<el-input v-model="form.name"></el-input>
		</el-form-item>

		<el-form-item label="旧密码" prop="uLoginPWD">
			<el-input v-model="editForm.uLoginPWD" type="text"  auto-complete="off"></el-input>
		</el-form-item>
		<el-form-item label="新密码" prop="uLoginPWD">
			<el-input v-model="editForm.uLoginPWD" show-password  auto-complete="off"></el-input>
		</el-form-item>

		<el-form-item label="留言/备注">
			<el-input type="textarea" v-model="form.desc"></el-input>
		</el-form-item>
		<el-form-item>
			<el-button type="primary">更新</el-button>
			<el-button @click.native.prevent>取消</el-button>
		</el-form-item>
	</el-form>
</template>

<script>
	export default {
		data() {
			return {
				form: {
					name: '',
					region: '',
					date1: '2019-01-01',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: ''
				},
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
                    addr: ''
                }
			}
		},
		methods: {
			onSubmit() {
				console.log('submit!');
			}
		}
	}

</script>
