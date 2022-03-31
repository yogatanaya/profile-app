import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import {  collection, addDoc } from 'firebase/firestore';
import { storage, db } from '../Firebase';

import {
  DocumentCard,
  DocumentCardDetails
} from '@fluentui/react/lib/DocumentCard';
import { Label } from '@fluentui/react/lib/Label';
import { TextField, MaskedTextField } from '@fluentui/react/lib/TextField';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { initializeIcons } from '@fluentui/font-icons-mdl2';
import {
  DatePicker, DayOfWeek, Spinner,
  defaultDatePickerStrings
} from '@fluentui/react';

export default function AddExperience() {

  let navigate = useNavigate();

  initializeIcons();
  
  const [ progress, setProgress ] = useState(0);
  const [ firstDayOfWeek, setFirstDayOfWeek ] = useState(DayOfWeek.Sunday)
  const [ startDate, setStartDate ] = useState("");
  const [ endDate, setEndDate ] = useState("");

  const [ formData, setFormData ] = useState({
    job_title: "",
    job_desc: "",
    company_logo_url: "",
    company_name: "",
    start_date: "",
    end_date: ""
  });
  
  const routeBack = () => {
    let path = `/`;
    navigate(path);
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      company_logo_url: e.target.files[0]
    })
  }

  const handleSave = () => {
    if (!formData.company_logo_url ||
        !formData.job_title || 
        !formData.job_desc || 
        !formData.company_name ||
        !formData.start_date ||
        !formData.end_date
      ) {
      alert('please fill all the field');
      return;
    } else {
      const storageRef = ref(storage, `/companies/${Date.now}${formData.company_logo_url.name}`);
      const uploadImage = uploadBytesResumable(storageRef, formData.company_logo_url);
      uploadImage.on("state_changed",
      (snapshot) => {
        const progressPercents = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes)*100
        ) 
        setProgress(progressPercents);
      },
      (err) => {
        console.log(err);
      },
      () => {
        setFormData({
          job_title: "",
          job_desc: "",
          company_name: "",
          company_logo_url: "",
          start_date: "",
          end_date: ""
        })

        getDownloadURL(uploadImage.snapshot.ref)
        .then((url) => {
          let expRef = collection(db, "work_experiences")
          addDoc(expRef, {
            job_title: formData.job_title,
            job_desc: formData.job_desc,
            company_name: formData.company_name,
            company_logo_url: url,
            start_date: formData.start_date,
            end_date: formData.end_date
          })
          .then(() => {
            alert('added succesfully!');
            setProgress(0)
          })
          .catch(err => {
           alert(err);
          })
        })
      }
      );
    };
  }

  return (
    <DocumentCard style={{ padding: '22px' }}>
      
      {progress === 0 ? null : (
        <Spinner size={Spinner.large} label={`progress uploading ... ${progress}`}/>
      )}

      <DocumentCardDetails>
        <form className='add-experiences'>
          <TextField label="Job Title" name='job_title' value={formData.job_title} onChange={(e) => handleChange(e)}/>
          <TextField label="Company" name='company_name' value={formData.company_name} onChange={(e) => handleChange(e)}/>
          <TextField label="Job Description" name='job_desc' multiline autoAdjustHeight value={formData.job_desc} onChange={(e) => handleChange(e)}/>
          <Label disabled>Start Date</Label>
          <TextField type="date" name="start_date" onChange={(e) => handleChange(e)} value={formData.start_date}/>
          <Label disabled>End Date</Label>
          <TextField type="date" name="end_date" onChange={(e) => handleChange(e)} value={formData.end_date}/>
          <Label disabled>Company Logo</Label>

          <input type="file" name="company_logo_url" accept='image/*' onChange={(e) => handleImageChange(e)}/>
          
          <div style={{ marginTop: '22px' }}>
            <PrimaryButton text='Save' onClick={handleSave}/>
            {" "}
            <DefaultButton text='Cancel' onClick={routeBack}/>
          </div>
         
        </form>
      </DocumentCardDetails>
    </DocumentCard>
  )
}