$(function() {

    var Playlist = Backbone.Model.extend({
        default: {
            songname: '',
            artist: '',
            url: '',
            duration: ''
        }
    });

    var Playlists = Backbone.Collection.extend({

        model: Playlist

    });

    ////////////////////////////////////////////////////////////////////////////////////////////


    var playlists = new Playlists([
        { songname: 'DUCKS', artist: 'Baby', url: 'https://www.youtube.com/embed/cujpd2O6_nw', duration: '5:00' },
        { songname: 'BEEMS', artist: 'SMIT', url: 'https://www.youtube.com/embed/MhvTDXLbXgM', duration: '4:00' },
        { songname: 'SHARK', artist: 'Crist', url: 'https://www.youtube.com/embed/j8z7UjET1Is', duration: '4:30' },
    ]);

    var customPlaylist = new Playlists();




    // DropDown View 




    var data = ['DUCKS', 'BEEMS', 'SHARK'];


    var DropdownView = Backbone.View.extend({
        el: "#dropdown",
        initialize: function() {

            this.render();

        },
        render: function() {

            this.collection.each(this.addSongs, this);


        },
        addSongs: function() {

            // data.push(song.attributes.songname);

            var options = $("<select>");
            options.attr({
                "id": "drpdwn"
            });
            var selectOption = $('<option>').val("select").text('Select');
            options.append(selectOption);

            _.each(data, function(val) {
                var option = $('<option>').val(val).text(val);
                options.append(option);

            })
            this.$el.html(options);
        }
    });



   // Song Details Template




    var DisplaySong = Backbone.View.extend({
        el: '#addToPlayList',
        template: _.template($('#songdetail').html()),

        events: {
            'click #addPlaylist': 'addPlaylist'
        },
        addPlaylist: function() {

            var name = $('#drpdwn').val();
            var collection = new Playlists(this.collection.where({ songname: name }))

            var duplicateModel = new Playlists(customPlaylist.where({ songname: name }));
            if (duplicateModel.length == 0) {
                customPlaylist.add(collection.models[0].attributes);
                var customPlaylistView = new CustomPlaylistView({ collection: customPlaylist });
                $('#playList').html(customPlaylistView.render().el);

            }
            else
            {
             alert("Hello! I am an alert box!!");
         };

        },

        initialize: function() {
            this.$el.html(this.template());
        }

    });





    //  Custom View Template





    var CustomPlaylistView = Backbone.View.extend({

        initialize: function() {
            this.collection.on('add', this.displayCustomSongs, this);
        },

        displayCustomSongs: function(song) {

            var displayCustomSong = new DisplayCustomSong({ model: song });
            this.$el.append(displayCustomSong.el);
        },

        render: function() {
            this.collection.each(this.displayCustomSongs, this);
            return this;

        }
    });





    //  Table View Template





    var DisplayCustomSong = Backbone.View.extend({

        // el: '#playList',

        template: _.template($('#customPlaylists').html()),

        events: {
            'click #delete-song': 'remove',
            'click #play-song': 'play'
        },

        play: function() {
            var displayVideo = new DisplayVideo(this.model);
            $('#playVideoDiv').show();

        },

        remove: function() {
            this.model.destroy();
            this.$el.remove();
            $('#playVideoDiv').hide();

        },

        initialize: function() {
            this.$el.html(this.template(this.model.attributes));

        }


    });




    //  Iframe Template






    var DisplayVideo = Backbone.View.extend({

        el: '#playVideoDiv',

        template: _.template($('#playVideo').html()),
       
     
        initialize: function(song) {
            this.$el.html(this.template(song.attributes));
        }

    })





    //  New Song Adding Template 







    var CreateNewSong = Backbone.View.extend({
        el: "#newSongDiv",
        template: _.template($("#newSong").html()),
        events: {
            'submit': 'addNewSong'
        },
        addNewSong: function(e) {
            e.preventDefault();

            var playlist = new Playlist({

                'songname': this.$el.find('#songname').val(),
                'artist': this.$el.find('#artist').val(),
                'url': this.$el.find('#url').val(),
                'duration': this.$el.find('#duration').val(),
            });
            this.collection.add(playlist);

            data.push(this.$el.find('#songname').val());

            router.navigate('', { trigger: true });

        },
        render: function() {
            this.$el.html(this.template());

        },
        initialize: function() {
            this.render();
        }
    })

    var createSong = new CreateNewSong({ collection: playlists })






    // Router Creation     






    var AppRouter = Backbone.Router.extend({
        routes: {
            '': 'index',
            'new-song': 'addSong',
        },
        index: function() {
            $('.container-fluid').show();
            $('#newSongDiv').hide();
            // var playlistView = new PlaylistView({ collection: playlists });

            // $('#songsTitle').html(playlistView.render().el);
            var view = new DropdownView({ collection: playlists });
            // var displaySong = new DisplaySong({ collection: playlists });


        },
        addSong: function() {
            $('.container-fluid').hide();
            $('#newSongDiv').show();

            createSong.render();
        }
    });

    var displaySong = new DisplaySong({ collection: playlists });

    var router = new AppRouter();

    Backbone.history.start();


});