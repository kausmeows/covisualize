/* Stores data in the database */
class DBInterface {
  //Authentication for database
  username: string;
  password: string;

  constructor(username: string , password: string){
      this.username = username;
      this.password = password;
  }

  connect(){
      //Put database connection code here
  }

  close(){
      //Close database connection here
  }

  async storeData(data: object){
      return new Promise((resolve, reject) => {
          setTimeout( () => {//Dummy asynchronous function
              resolve("Data stored: " + JSON.stringify(data));
          }, 1000);
      });
  }
}

/* Downloads data from web service */
class DataDownloader {
  url: string;

  constructor(url: string){
      this.url = url;
  }

  async getDataFromWebService(){
      return new Promise((resolve, reject) => {
          setTimeout( () => {//Dummy asynchronous function
              resolve({data: "Some data"});
          }, 500);
      });
  }
}

/* Contains the main logic of the application */
class Main {
  dbInterface: DBInterface;
  dataDownloader: DataDownloader;

  constructor(){
      //Create instances of classes
      this.dbInterface = new DBInterface("abc", "xyz");
      this.dataDownloader = new DataDownloader("https://corona.lmao.ninja/v2/historical/");
  }

  async downloadData(){
      this.dbInterface.connect();
      try{
          //Get promise to download data
          let downloadPromise = this.dataDownloader.getDataFromWebService();

          //Execute promise and wait for result.
          let data: any = await downloadPromise;
          console.log("Data downloaded: " + JSON.stringify(data));

          //Pass data to database to store
          let storeDataPromise = this.dbInterface.storeData(data);

          let result = await storeDataPromise;
          console.log("Result: " + result);
      }
      catch(err){
          console.error("Error occurred: " + err);
      }
      finally{
          this.dbInterface.close();
      }
  }
}

let main: Main = new Main();
main.downloadData();
