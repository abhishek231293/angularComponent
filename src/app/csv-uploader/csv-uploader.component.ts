import { Component, OnInit } from '@angular/core';
import {  FileUploader, FileSelectDirective } from 'ng2-file-upload/ng2-file-upload';
import { CommonService } from '../_services';
// import { HttpEventType } from '@angular/common/http';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-csv-uploader',
  templateUrl: './csv-uploader.component.html',
  styleUrls: ['./csv-uploader.component.css']
})
export class CsvUploaderComponent implements OnInit {

  uploadButton:string = 'Upload';
  route:string;
  error:boolean=false;
  success:boolean=false;
  errorMessage:string='';
  successMessage:string='';
  selectedFile : FileList;
  data = [];
  fileType:string = 'none';
  public apiBaseUrl: string = environment.apiBaseUrl;

  constructor(private router: Router,
              private _service: CommonService) { }
  ngOnInit() {

  }

  public saveData(csvData:any){


    this.route  = 'upload-csv';
    const formData = new FormData();
    formData.append('csvData',csvData,csvData.name);
    formData.append('type',this.fileType);

    const token    = localStorage.getItem('userToken');
    // this._service.getRequestCreator(data, this.route, token).subscribe((result: any) => {
    this._service.postRequestCreator(formData, this.route, token)
        .subscribe((response) => {

          // console.log(event.type,HttpEventType.UploadProgress);
          // console.log(event.type,HttpEventType.Response);

          // if(event.type === HttpEventType.UploadProgress){
          //   console.log('Upload Progress : ' + Math.round(event.loaded/event.total* 100 ) + "%" );
          // }else if(event.type === HttpEventType.Response){


            // if(response.status == 'success'){
            this.success = true;
            this.successMessage = 'File uploaded successfully';
            this.fileType = 'none';
            this.uploadButton = 'Upload';
            this.error = false;
          // }


          // }
        });

  }

  public changeListener(files: FileList){
    this.success = false;
    this.error = false;
    this.successMessage = '';
    this.errorMessage = '';
    this.selectedFile = files;
  }

  public uploadListener(){

    this.uploadButton = 'Uploading';
    this.success = false;
    this.error = false;
    this.successMessage = '';
    this.errorMessage = '';

    if(this.fileType == 'none'){
      this.uploadButton = 'Upload';
      this.error = true;
      this.errorMessage = 'Please select file type';
      return;
    }

    if(this.selectedFile && this.selectedFile.length > 0) {
      let file : File = this.selectedFile.item(0);
      let size : number = file.size; //in byte
      if(file.type == 'text/csv'){
        if((size/1000)/1000 <= 10){

          let reader: FileReader = new FileReader();
          reader.readAsText(file);
          reader.onload = (e) => {
            // let csv: string = reader.result;
            this.saveData(file);
          }
        }else{
          this.uploadButton = 'Upload';
          this.error = true;
          this.errorMessage = 'Max file size is 10 MB.';
        }
      }else{
        this.uploadButton = 'Upload';
        this.error = true;
        this.errorMessage = 'Only CSV file accepted';
      }

    }else{
      this.uploadButton = 'Upload';
      this.error = true;
      this.errorMessage = 'Invalid File';
    }
  }
}
