// TODO remove global socket
var socket = undefined;

var ActBox = React.createClass({
	render: function() {
		return (
			<div className="actBox">
			<div className="page-header">
			<h1>Baby scheduler v0.1.1</h1>
			</div>
			<ActForm />
			<ActList />
			</div>
		)
	}
});
var ActList = React.createClass({
	getInitialState: function() {
		return {
			acts: []
		}
	},
	componentDidMount: function() {
		socket = io.connect(document.location.href);
		socket.on('error', function (error) {
		  console.error('Error on socket', error);
		});
		socket.on('refreshActs', function(data) {
			this.setState(data);
		}.bind(this));
	},
	render: function() {
		var actNodes = this.state.acts
		.map(function(act) {
			return (
				<Act act={act} key={act.id} />
			)
		});
		return (
			<div className="actList">
			<h3>Недавние активности</h3>
			{actNodes}
			</div>
		);
}
});
var Act = React.createClass({
	getInitialState: function(){
		var now = moment();
		return {
			'act.finish.date': now.format('YYYY-MM-DD'),
			'act.finish.time': now.format('HH:mm')
		};
	},
	componentDidMount: function() {
		var self = this;
		var datetimeInterval = setInterval(function() {
			var now = moment();
			self.setState({
				'act.finish.date': now.format('YYYY-MM-DD'),
				'act.finish.time': now.format('HH:mm')
			});
		}, 2 * 60 * 1000);

		self.setState({
			datetimeInterval: datetimeInterval
		});
	},
	componentWillUnmount: function() {
		clearInterval(this.state.datetimeInterval);
	},
	handleTimeChange: function(e) {
		this.setState({
			'act.finish.time': e.target.value
		});
	},
	handleFinish: function(e) {
		e.preventDefault();
		var id = this.props.act.id;
		var self = this;
		socket.emit('finishAct', {
			act: {
				id: id,
				finish: {
					date: self.state["act.finish.date"],
					time: self.state["act.finish.time"]
				}
			}
		});
	},
	handleDelete: function(e) {
		e.preventDefault();
		var id = this.props.act.id;
		socket.emit('deleteAct', {
			act: {
				id: id
			}
		});
	},
	render: function () {
		// TODO Remove ternary operator when data is consistent
		var topProperties = [
			<div className="col-md-2 col-xs-4" key="date">{this.props.act.start.date}</div>
		];
		if (this.props.act.finish) {
			topProperties.push(
				<div className="col-md-6 col-xs-6" key="time">
				{this.props.act.start.time} - {this.props.act.finish.time}
				</div>
			)
		} else {
			topProperties.push(
				<div className="col-md-6 col-xs-6" key="time">
				{this.props.act.start.time} -
				<input
					type="time"
					className="form-control"
					value={this.state["act.finish.time"]}
					onChange={this.handleTimeChange}
					/>
				</div>
			)
		}
		if (!this.props.act.finish) {
			topProperties.push(
				<div className="col-md-1 col-xs-2" key="button">
					<input
						type="submit"
						className="btn btn-primary btn-block btn-xs"
						value="F" />
						</div>
			);
		}
		var topLine = <div className="row">
			<div id="equalheight">
			{topProperties}
			</div>
		</div>;

		var bottomProperties = [
			<div className="col-md-2 col-xs-4" key="type">{this.props.act.type}</div>
		];
		if (this.props.act.comment) {
			bottomProperties.push(
				<div className="col-md-6 col-xs-6 light" key="comment">{this.props.act.comment}</div>
			);
		};
		bottomProperties.push(
			<div className="col-md-1 col-xs-2" key="button">
				<input
					type="submit"
					className="btn btn-primary btn-block btn-xs"
					value="D" />
					</div>
		);

		var bottomLine = <div className="row">
		{bottomProperties}
		</div>;

		return (
			<div className="act">
				<form className="actForm" onSubmit={this.handleFinish}>
				{topLine}
				</form>
				<form className="actForm" onSubmit={this.handleDelete}>
				{bottomLine}
				</form>
				<hr/>
			</div>
		)
	}
});
var ActForm = React.createClass({
	getInitialState: function() {
		var now = moment();

		return {
			'act.start.date': now.format('YYYY-MM-DD'),
			'act.start.time': now.format('HH:mm'),
			'act.type': 'Сон',
			'act.comment': ''
		};
	},
	componentDidMount: function() {
		var self = this;
		var datetimeInterval = setInterval(function() {
			var now = moment();
			self.setState({
				'act.start.date': now.format('YYYY-MM-DD'),
				'act.start.time': now.format('HH:mm')
			});
		}, 2 * 60 * 1000);

		self.setState({
			datetimeInterval: datetimeInterval
		});
	},
	componentWillUnmount: function() {
		clearInterval(this.state.datetimeInterval);
	},
	handleDateChange: function(e) {
		this.setState({
			'act.start.date': e.target.value
		});
	},
	handleTimeChange: function(e) {
		this.setState({
			'act.start.time': e.target.value
		});
	},
	handleTypeChange: function(e) {
		this.setState({
			'act.type': e.target.value
		});
	},
	handleCommentChange: function(e) {
		this.setState({
			'act.comment': e.target.value
		});
	},
	handleSubmit: function(e) {
		e.preventDefault();
		if (!this.state['act.start.date'] || !this.state['act.start.time'] ||
				!this.state['act.type']){
					return;
		}
		socket.emit('createAct', {
			act: {
				start: {
					date: this.state['act.start.date'],
					time: this.state['act.start.time']
				},
				type: this.state['act.type'],
				comment: this.state['act.comment']
			}
		});

		var now = moment();
		this.setState({
			'act.start.date': now.format('YYYY-MM-DD'),
			'act.start.time': now.format('HH:mm'),
			'act.type': 'Сон',
			'act.comment': ''
		});
	},
	render: function () {
		var self = this;
		var typeNodes = ['Сон', 'Кормление', 'Активное бодрствование'].map(function(type, id) {
			return (
				<label
					htmlFor={'type-' + id}
					className={"btn btn-primary" + (self.state["act.type"] == type ? ' active' : '')}
					key={id}>
				{type}
				<input type="radio" name="type" className="hidden" value={type} id={'type-' + id}
				checked={self.state["act.type"] == type} onChange={self.handleTypeChange}/>
				</label>
			)
		});
		return (
			<form className="actForm" onSubmit={this.handleSubmit}>
				<h3>Новая активность</h3>
				Дата:
				<input
					type="date"
					className="form-control"
					value={this.state["act.start.date"]}
					onChange={this.handleDateChange}
				/>
				<br/>
				Время:
				<input
					type="time"
					className="form-control"
					value={this.state["act.start.time"]}
					onChange={this.handleTimeChange}
				/>
				<br/>

				Занятие:<br/>
				<div className="btn-group" data-toggle="buttons">
				{typeNodes}
				</div>
				<br/><br/>

				Комментарий:
				<input
					type="text"
					className="form-control"
					value={this.state["act.comment"]}
					onChange={this.handleCommentChange}
				/>
				<br/>
				<input
					type="submit"
					className="btn btn-lg btn-primary btn-block"
					value="Начать" />
				</form>
		)
	}
});

ReactDOM.render(
	<ActBox/>,
  document.getElementById('content')
);
