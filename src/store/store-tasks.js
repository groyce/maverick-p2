import Vue from 'vue'
import { uid, Notify } from 'quasar'
import {firebaseDb, firebaseAuth} from 'boot/firebase'
import { showErrorMessage } from 'src/functions/function-show-error-message'

const state = {
	tasks: {
	//	'ID1': {
	//		name: 'Go to shop',
	//		completed: false,
	//		dueDate: '2019/05/12',
	//		dueTime: '18:30'
	//	},
	//	'ID2': {
	//		name: 'Get bananas',
	//		completed: false,
	//		dueDate: '2019/05/13',
	//		dueTime: '14:00'
	//	},
	//	'ID3': {
	//		name: 'Get apples',
	//		completed: false,
	//		dueDate: '2019/05/14',
	//		dueTime: '16:00'
	//	}
	},
	
	
	tasksDownloaded: false
}

const mutations = {
	updateTask(state, payload) {
		Object.assign(state.tasks[payload.id], payload.updates)
	},
	deleteTask(state, id) {
		Vue.delete(state.tasks, id)
	},
	addTask(state, payload) {
		Vue.set(state.tasks, payload.id, payload.task)
	},
	clearTasks(state) {
		state.tasks = {}
	},
	
}

const actions = {
	updateTask({ dispatch }, payload) {
		dispatch('fbUpdateTask', payload)
	},
	deleteTask({ dispatch }, id) {
		dispatch('fbDeleteTask', id)
	},
	addTask({ dispatch }, task) {
		let taskId = uid()
		let payload = {
			id: taskId,
			task: task
		}
		dispatch('fbAddTask', payload)
	},
	
	fbReadData ({ commit }) {
		console.log('start reading data from Firebase')
		let userId = firebaseAuth.currentUser.uid
		let userTasks= firebaseDb.ref('tasks/' + userId)

		// initial check for data
		userTasks.once('value', snapshop => {
			commit('setTasksDownloaded', true)
		}, error => {
			showErrorMessage(error.message)
			this.$router.replace('/auth')
		})

		// child added
		userTasks.on('child_added',snapshot =>{
			
			let task = snapshot.val()
			let payload = {
				id:snapshot.key,
				task:task
			}
			commit('addTask', payload)
		})
			// child changed
		userTasks.on('child_changed', snapshot => {
			let task = snapshot.val()
			let payload = {
				id: snapshot.key,
				updates: task
			}
			commit('updateTask', payload)
			})

			// child removed
		userTasks.on('child_removed', snapshot => {
			let taskId = snapshot.key
			commit('deleteTask', taskId)
		})
	},
	fbAddTask({}, payload) {
		let userId = firebaseAuth.currentUser.uid
		let taskRef = firebaseDb.ref('tasks/' + userId + '/' + payload.id)
		taskRef.set(payload.task, error => {
			if (error) {
				showErrorMessage(error.message)
			}
			else {
				Notify.create('Task added!')
			}
		})

	},
	fbUpdateTask({}, payload) {
		let userId = firebaseAuth.currentUser.uid
		let taskRef = firebaseDb.ref('tasks/' + userId + '/' + payload.id)
		taskRef.update(payload.updates, error => {
			if (error) {
				showErrorMessage(error.message)
			}
			else {
				let keys = Object.keys(payload.updates)
				if (!(keys.includes('completed') && keys.length == 1)) {
					Notify.create('Task updated!')
				} 
			}
		})
	},
	fbDeleteTask({}, taskId) {
		let userId = firebaseAuth.currentUser.uid
		let taskRef = firebaseDb.ref('tasks/' + userId + '/' + taskId)
		taskRef.remove(error => {
			if (error) {
				showErrorMessage(error.message)
			}
			else {
				Notify.create('Task deleted!')
			}
		})
	}	
}

const getters = {
	tasks: (state) => {
		return state.tasks
	}
}

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters
}