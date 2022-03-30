import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../Firebase';
import { Label } from '@fluentui/react/lib/Label';
import { Separator } from '@fluentui/react/lib/Separator';
import { Image } from '@fluentui/react/lib/Image';
import { Text } from '@fluentui/react/lib/Text';

export default function ExperienceList() {
  
  const [workExperiences, setWorkExperiences] = useState([]);

  useEffect(() => {
    
    let wrkExpRef = collection(db, "work_experiences")

    let q = query(wrkExpRef, orderBy("company_name", "desc"));

    onSnapshot(q, (snapshot) => {
      let experiences = snapshot.docs.map((doc) => ({
        id: doc.id, 
        ...doc.data()
      }))
      setWorkExperiences(experiences);
    })
  }, [])

  return (
    <div>
      {
        workExperiences.length === 0 ? (
          <p>please wait...</p>
        ) : (
          <div>
            {
              workExperiences.map(({ id, company_name, start_date, end_date, job_desc, job_title, company_logo_url }) => 
                <div key={id} className="ms-Grid">
                  <div className="ms-Grid-row">
                    <div className="ms-Grid-col">
                      <Image src={company_logo_url} alt={company_name} style={{ borderRadius: '50%', width: '60px', marginBottom: '22px' }}/>
                    </div>
                    <div className="ms-Grid-col">  
                      <Label disabled>Job Title</Label>
                      <Text variant='medium'>
                        {job_title}
                      </Text>
                      <Label disabled>Company</Label>
                      <Text variant='medium'>
                        {company_name}
                      </Text>
                      <Label disabled>Job Description</Label>
                      <Text variant='medium'>
                        {job_desc ?? "-"}
                      </Text>
                      <Label disabled>Period Working</Label>
                      <Text variant='medium'>
                        {start_date} - {end_date}
                      </Text>
                    </div>
                    <Separator></Separator>
                  </div>
                  
                </div>
              )
            }
          </div>
        )
      }
    </div>
  )
}