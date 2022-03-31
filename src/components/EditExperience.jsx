import React, { useEffect, useState } from 'react';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import {  collection, addDoc, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { storage, db } from '../Firebase';
import { useNavigate, useParams } from 'react-router-dom';

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

export default function EditExperience() {

  initializeIcons();

  let navigate = useNavigate();
  const { id } = useParams();
  
  const [ workExperiences, setWorkExperience ] = useState(null);
  const [ firstDayOfWeek, setFirstDayOfWeek ] = useState(DayOfWeek.Sunday)
  
  const [ jobTitle, setJobTitle ] = useState("");
  const [ jobDesc, setJobDesc ] = useState("");
  const [ companyName, setCompanyName ] = useState("");
  const [ companyLogoUrl, setCompanyLogoUrl ] = useState("");
  const [ startDate, setStartDate ] = useState("");
  const [ endDate, setEndDate ] = useState("");

  const [ progress, setProgress ] = useState(0);

  const routeBack = () => {
    let path = `/`;
    navigate(path);
  }

  useEffect(() => {
    const docRef = doc(db, "work_experiences", id);
    onSnapshot(docRef, (snapshot) => {
      setWorkExperience({
        ...snapshot.data(),
        id: snapshot.id
      });
    })
  }, []);

  const handleSave = async (paramId, paramJobTitle, paramCompanyName,
    paramJobDesc, paramCompanyLogoUrl, paramStartDate, paramEndDate) => {
    const storageRef = ref(storage, `companies/${Date.now()}${paramCompanyLogoUrl.name}`);
    const uploadImage = uploadBytesResumable(storageRef, paramCompanyLogoUrl);
    uploadImage.on("state_changed", 
      (snapshot) => {
        const progressPercents = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        )
        setProgress(progressPercents);
      }, 
      (err) => {
        console.log(err);
      },
      () => {
        getDownloadURL(uploadImage.snapshot.ref)
        .then((url) => {
          const candidateRef = doc(db, "work_experiences", paramId);
          updateDoc(candidateRef, {
            job_title: paramJobTitle,
            job_desc: paramJobDesc,
            company_logo_url: url,
            company_name: paramCompanyName,
            start_date: paramStartDate,
            end_date: paramEndDate
          })
          .then(() => {
            alert('updated successfully!');
            setProgress(0)
          })
          .catch(err => {
            alert(err);
          }) 
        })
      }
    )
  }

  return (
    <DocumentCard style={{ padding: '22px' }}>

      {
        progress === 0 ? null : (
          <Spinner size={Spinner.large} label={`uploading in progress ... ${progress}`} />
        )
      }

      { workExperiences && (

      <DocumentCardDetails>
        <form className='add-experiences'>
          <TextField label="Job Title" name='job_title' placeholder={workExperiences.job_title} onChange={(e) => setJobTitle(e.target.value)}/>
          <TextField label="Company" name='company_name' placeholder={workExperiences.company_name}  onChange={(e) => setCompanyName(e.target.value)}/>
          <TextField label="Job Description" name='job_desc' placeholder={workExperiences.job_desc} multiline autoAdjustHeight  onChange={(e) => setJobDesc(e.target.value)}/>
          <Label disabled>Start Date</Label>

          <TextField type="date" name="start_date" onChange={(e) => setStartDate(e.target.value)}/>

          <Label disabled>End Date</Label>
          
          <TextField type="date" name="end_date" onChange={(e) => setEndDate(e.target.value)}/>

          <Label disabled>Company Logo</Label>

          <input type="file" name="company_logo_url" accept='image/*' onChange={(e) => setCompanyLogoUrl(e.target.files[0])}/>
          
          <div style={{ marginTop: '22px' }}>
            <PrimaryButton text='Save' onClick={() => handleSave(workExperiences.id, jobTitle,companyName,jobDesc, companyLogoUrl, startDate, endDate)}/>
            {" "}
            <DefaultButton text='Cancel' onClick={routeBack}/>
          </div>
         
        </form>
      </DocumentCardDetails>
      
      )}

    </DocumentCard>
  )
}