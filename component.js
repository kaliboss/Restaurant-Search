Vue.component('restaurant-table',{
	props: ['result'],
	template: `<div class="col-md-12">
				<table class="table table-striped table-sm">
				<tr>
					<th>Restaurant</th>
					<th>Address</th>
					<th>Menu</th>
				</tr>
				<tr v-for = "r in result">
					<td>{{r.restaurant.name}}</td>
					<td>{{r.restaurant.location.address}}</td>
					<td><a v-bind:href = "r.restaurant.menu_url">View the menu on Zomato.com</a></td>
					<td><button type="submit" @click = "app.firebaseSave"><img src="favorite.png" alt="favorite button" height="20" width="20"></button></td>
				</tr>
			</table>
			</div>`
});