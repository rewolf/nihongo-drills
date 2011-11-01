
(function (ns) {

	var _u, batches;
	_u = JAP.util;
	
	batches = {};

	function onBatchComplete (batch) {
		batch.done = true;
		for (var i = 0; i < batch.watchers.length ; i++){
			if (batch.watchers[i].onImagesReady) {
				batch.watchers[i].onImagesReady();
			}
		}
	}

	/********************************************************************
	 * Start a batch of images loading and calls the callback function
	 * when each of them has either loaded or failed to load.
	 *******************************************************************/
	ns.loadBatch = function(name, URLs) {
		var batchCallback, batchFailCallback, i, count, completed, failed, img, batch;

		batch		= {
			name:		name,
			watchers:	[]
		};
		
		batch.count 		= URLs.length;
		batch.completed 	= 0;
		batch.failed		= 0;
		batch.done			= false;
		batches[name]		= batch;


		batchCallback = function () {
			batch.completed += 1;

			if (batch.completed + batch.failed >= batch.count){
				onBatchComplete(batch);
			}
		};

		batchFailCallback = function () {
			batch.failed += 1;

				
			if (batch.completed + batch.failed >= batch.count){
				onBatchComplete(batch);
			}
		};

		for (i = 0; i < URLs.length; i++){
			img 		= new Image();
			img.onload 	= batchCallback;
			img.onerror	= batchFailCallback;
			img.onabort	= batchFailCallback;
			img.src		= URLs[i];
		}
	}

	/***************************************************************************
	 * Adds the given object to the list of objects waiting on this batch. The
	 * given object should have a onImagesReady method which will be called
	 * when the image loading is complete for the batch
	 **************************************************************************/
	ns.watchBatch = function (name, watcher) {
		var batch;

		batch = batches[name];
		if (batch) {
			if (batch.done) {
				// Already loaded, so call the ready method
				watcher.onImagesReady();
			}
			else {
				batch.watchers.push(watcher);
			}
		}
		else {
			throw "Invalid image batch name";
		}
	};

	/***************************************************************************
	 * Returns a number in range [0, 1] indicating the progress of the loading
	 * of the batch
	 **************************************************************************/
	ns.getBatchProgress = function (name) {
		var batch = batches[name];

		if (batch) {
			return (batch.failed+batch.completed)/batch.count;
		}
		throw "Invalid image batch name";
	};


})( JAP.namespace("JAP.image") );
