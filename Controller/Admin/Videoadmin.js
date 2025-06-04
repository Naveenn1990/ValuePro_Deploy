const { uploadFile2 } = require("../../Config/AWS");
const videomodel = require("../../Modal/Admin/Videoadmin");

class Videoadmin {
  async AddVideo(req, res) {
    try {
      let { video } = req.body;
      console.log(video, "video>>>>>>>");

      // Initialize object to store the file details
      let obj = {
        video,
      };

      // Check if files are uploaded
      if (req.files && req.files.length != 0) {
        let arr = req.files;
        console.log(arr, "files>>>>");

        // Loop through uploaded files
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].fieldname == "video") {
            obj["video"] = await uploadFile2(arr[i], "training"); // Store filename in the object
          }
        }
      }

      // Save the video info in MongoDB
      let data = await videomodel.create(obj);
      console.log("data", data);

      // Handle response based on data
      if (!data) return res.status(400).json({ error: "Data not found" });
      return res.status(200).json({ success: "Successfully added", data });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server Error" });
    }
  }

  async getVideo(req, res) {
    try {
      let allVideo = await videomodel.find({}); // Fetch all videos from the database
      return res.status(200).json({ success: true, data: allVideo });
    } catch (error) {
      console.error('Error fetching videos:', error);
      return res.status(500).json({ success: false, message: 'Server Error' }); // Return error message
    }
  }

  async updateVideo(req, res) {
    try {
      const videoId = req.params.id; // Get video ID from the URL
      let { video } = req.body; // Get video details from the request body

      // Initialize object to store updated video details
      let updateObj = { video };

      // Check if files are uploaded
      if (req.files && req.files.length != 0) {
        let arr = req.files;
        console.log(arr, "files>>>>");

        // Loop through uploaded files
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].fieldname === "video") {
            updateObj["video"] = await uploadFile2(arr[i], "training"); // Store new filename
          }
        }
      }

      // Find the video by ID and update its details
      let updatedVideo = await videomodel.findByIdAndUpdate(videoId, updateObj, {
        new: true, // Return the updated document
        runValidators: true // Ensure the updated document is validated
      });

      console.log("Updated Video:", updatedVideo);

      // If video not found, send 404 response
      if (!updatedVideo) {
        return res.status(404).json({ error: "Video not found" });
      }

      // Return success response with updated data
      return res.status(200).json({ success: "Video updated successfully", data: updatedVideo });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server Error" });
    }
  }
}

module.exports = new Videoadmin();

