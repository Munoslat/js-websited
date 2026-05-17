const SUBJECTS=['Xisaab','Ingiriisi','Sayniska','Taariikhda','Cilmiga Diinta','Jimicsiga'];
const DAYS=['Isniin','Talaado','Arbaco','Khamiis','Jimco'];
const TIMES=['8:00-9:00','9:00-10:00','10:00-11:00','11:00-11:30','11:30-12:30','12:30-1:30','1:30-2:30'];
const TT=[
  ['Xisaab','Ingiriisi','Sayniska','Xisaab','Ingiriisi'],
  ['Ingiriisi','Xisaab','Taariikhda','Sayniska','Cilmiga Diinta'],
  ['Sayniska','Taariikhda','Xisaab','Ingiriisi','Xisaab'],
  ['Nasasho ☕','Nasasho ☕','Nasasho ☕','Nasasho ☕','Nasasho ☕'],
  ['Taariikhda','Cilmiga Diinta','Ingiriisi','Jimicsiga','Taariikhda'],
  ['Cilmiga Diinta','Sayniska','Jimicsiga','Taariikhda','Sayniska'],
  ['Jimicsiga','Jimicsiga','Cilmiga Diinta','Cilmiga Diinta','Jimicsiga'],
];

let students=JSON.parse(localStorage.getItem('ys_students')||'[]');
let teachers=JSON.parse(localStorage.getItem('ys_teachers')||'[]');
let grades=JSON.parse(localStorage.getItem('ys_grades')||'{}');
let attendance=JSON.parse(localStorage.getItem('ys_att')||'{}');
let editStuIdx=-1,editTchIdx=-1;

if(!students.length){
  students=[
    {id:'YS-001',name:'Faadumo Xasan',grade:'Grade 10',gender:'Gabar',age:16,phone:'+252615001001',status:'Xaadir'},
    {id:'YS-002',name:'Maxamed Aaden',grade:'Grade 11',gender:'Wiil',age:17,phone:'+252615001002',status:'Xaadir'},
    {id:'YS-003',name:'Xaliimo Cabdi',grade:'Grade 9',gender:'Gabar',age:15,phone:'+252615001003',status:'Maqan'},
    {id:'YS-004',name:'Cabdi Warsame',grade:'Grade 12',gender:'Wiil',age:18,phone:'+252615001004',status:'Xaadir'},
    {id:'YS-005',name:'Saado Cumar',grade:'Grade 9',gender:'Gabar',age:14,phone:'+252615001005',status:'Xaadir'},
    {id:'YS-006',name:'Yuusuf Nuur',grade:'Grade 10',gender:'Wiil',age:16,phone:'+252615001006',status:'Daahsanaa'},
  ];
  save();
}
if(!teachers.length){
  teachers=[
    {name:'Axmed Cali',subject:'Xisaab',exp:'8 sano',phone:'+252615002001',qual:'M.Ed',email:'axmed@yamees.edu'},
    {name:'Hodan Xirsi',subject:'Ingiriisi',exp:'5 sano',phone:'+252615002002',qual:'B.Ed',email:'hodan@yamees.edu'},
    {name:'Yuusuf Nuur',subject:'Sayniska',exp:'10 sano',phone:'+252615002003',qual:'PhD',email:'yuusuf@yamees.edu'},
    {name:'Amina Farah',subject:'Taariikhda',exp:'6 sano',phone:'+252615002004',qual:'M.Ed',email:'amina@yamees.edu'},
  ];
  save();
}

function save(){
  localStorage.setItem('ys_students',JSON.stringify(students));
  localStorage.setItem('ys_teachers',JSON.stringify(teachers));
  localStorage.setItem('ys_grades',JSON.stringify(grades));
  localStorage.setItem('ys_att',JSON.stringify(attendance));
}

// NAV
function showPage(id){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-links a').forEach(a=>a.classList.remove('active'));
  document.getElementById('page-'+id).classList.add('active');
  const el=document.getElementById('nav-'+id);
  if(el)el.classList.add('active');
  if(id==='home')updateKPIs();
  if(id==='students')renderStudents();
  if(id==='teachers')renderTeachers();
  if(id==='grades'){populateGradeSelects();renderGradeTable();renderResultTable();}
  if(id==='attendance')renderAttendance();
  if(id==='timetable')renderTimetable();
  if(id==='reports')renderReports();
}

// KPI
function updateKPIs(){
  document.getElementById('kpi-students').textContent=students.length;
  document.getElementById('kpi-teachers').textContent=teachers.length;
  const today=new Date().toDateString();
  const ta=attendance[today]||{};
  const pres=Object.values(ta).filter(v=>v==='Xaadir').length;
  document.getElementById('kpi-att').textContent=students.length?Math.round(pres/students.length*100)+'%':'—';
  const days=['Axad','Isniin','Talaado','Arbaco','Khamiis','Jimco','Sabti'];
  document.getElementById('today-label').textContent=days[new Date().getDay()];
}

// STUDENTS
function renderStudents(){
  const q=(document.getElementById('stu-search').value||'').toLowerCase();
  const gf=document.getElementById('stu-filter').value;
  const list=students.filter(s=>(!q||s.name.toLowerCase().includes(q)||s.id.toLowerCase().includes(q))&&(!gf||s.grade===gf));
  const tbody=document.getElementById('stu-body');
  if(!list.length){tbody.innerHTML='<tr><td colspan="7" style="text-align:center;color:var(--muted);padding:2rem">Arday lama helin</td></tr>';return;}
  tbody.innerHTML=list.map(s=>{
    const ri=students.indexOf(s);
    const ini=s.name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase();
    const sc=s.status==='Xaadir'?'badge-pass':s.status==='Maqan'?'badge-fail':'badge-late';
    return `<tr>
      <td><div class="student-cell"><div class="avatar">${ini}</div><div><div style="font-weight:600;font-size:.85rem">${s.name}</div><div style="font-size:.72rem;color:var(--muted)">${s.id}</div></div></div></td>
      <td><span class="badge" style="background:rgba(0,212,170,.1);color:var(--accent)">${s.grade}</span></td>
      <td>${s.gender}</td><td>${s.age||'—'}</td>
      <td style="color:var(--muted);font-size:.8rem">${s.phone||'—'}</td>
      <td><span class="badge ${sc}">${s.status}</span></td>
      <td><div style="display:flex;gap:.4rem">
        <button class="btn btn-gold btn-sm" onclick="editStudent(${ri})">✏️</button>
        <button class="btn btn-danger btn-sm" onclick="deleteStudent(${ri})">🗑️</button>
      </div></td>
    </tr>`;
  }).join('');
}

function openStudentModal(idx=-1){
  editStuIdx=idx;
  document.getElementById('modal-stu-title').textContent=idx>=0?'Wax Ka Beddel Arday':'Ku Dar Arday Cusub';
  const s=idx>=0?students[idx]:{};
  document.getElementById('sf-name').value=s.name||'';
  document.getElementById('sf-id').value=s.id||`YS-${String(students.length+1).padStart(3,'0')}`;
  document.getElementById('sf-grade').value=s.grade||'Grade 9';
  document.getElementById('sf-gender').value=s.gender||'Wiil';
  document.getElementById('sf-age').value=s.age||'';
  document.getElementById('sf-phone').value=s.phone||'';
  document.getElementById('modal-student').classList.add('open');
}
function editStudent(i){openStudentModal(i);}
function deleteStudent(i){
  if(!confirm('Ma hubtaa inaad tirtirto '+students[i].name+'?'))return;
  students.splice(i,1);save();renderStudents();showToast('Arday waa la tirtiray','❌');
}
function saveStudent(){
  const name=document.getElementById('sf-name').value.trim();
  const id=document.getElementById('sf-id').value.trim();
  if(!name||!id){showToast('Magaca iyo ID buuxi!','⚠️');return;}
  const s={name,id,grade:document.getElementById('sf-grade').value,gender:document.getElementById('sf-gender').value,age:document.getElementById('sf-age').value,phone:document.getElementById('sf-phone').value,status:'Xaadir'};
  if(editStuIdx>=0)students[editStuIdx]=s;else students.push(s);
  save();closeModal('modal-student');renderStudents();updateKPIs();
  showToast(editStuIdx>=0?'Arday waa la cusbooneysiiyay':'Arday cusub waa la daray','✅');
}

// TEACHERS
function renderTeachers(){
  const q=(document.getElementById('tch-search').value||'').toLowerCase();
  const list=teachers.filter(t=>!q||t.name.toLowerCase().includes(q)||t.subject.toLowerCase().includes(q));
  const grid=document.getElementById('tch-grid');
  if(!list.length){grid.innerHTML='<p style="color:var(--muted)">Macallin lama helin</p>';return;}
  grid.innerHTML=list.map((t)=>{
    const ri=teachers.indexOf(t);
    const ini=t.name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase();
    return `<div class="teacher-card">
      <div class="tch-top"><div class="tch-avatar">${ini}</div><div><div class="tch-name">${t.name}</div><div class="tch-subj">${t.subject}</div></div></div>
      <div class="tch-info">
        <div class="tch-row">🎓 Shahaad: <span>${t.qual}</span></div>
        <div class="tch-row">⏱ Khibrad: <span>${t.exp||'—'}</span></div>
        <div class="tch-row">📞 Tel: <span>${t.phone||'—'}</span></div>
        <div class="tch-row">✉️ <span style="font-size:.72rem">${t.email||'—'}</span></div>
      </div>
      <div class="tch-actions">
        <button class="btn btn-gold btn-sm" onclick="editTeacher(${ri})">✏️ Beddel</button>
        <button class="btn btn-danger btn-sm" onclick="deleteTeacher(${ri})">🗑️ Tirtir</button>
      </div>
    </div>`;
  }).join('');
}
function openTeacherModal(idx=-1){
  editTchIdx=idx;
  document.getElementById('modal-tch-title').textContent=idx>=0?'Wax Ka Beddel Macallin':'Ku Dar Macallin Cusub';
  const t=idx>=0?teachers[idx]:{};
  document.getElementById('tf-name').value=t.name||'';
  document.getElementById('tf-subject').value=t.subject||'Xisaab';
  document.getElementById('tf-exp').value=t.exp||'';
  document.getElementById('tf-phone').value=t.phone||'';
  document.getElementById('tf-qual').value=t.qual||'B.Ed';
  document.getElementById('tf-email').value=t.email||'';
  document.getElementById('modal-teacher').classList.add('open');
}
function editTeacher(i){openTeacherModal(i);}
function deleteTeacher(i){
  if(!confirm('Ma hubtaa inaad tirtirto '+teachers[i].name+'?'))return;
  teachers.splice(i,1);save();renderTeachers();showToast('Macallin waa la tirtiray','❌');
}
function saveTeacher(){
  const name=document.getElementById('tf-name').value.trim();
  if(!name){showToast('Magaca buuxi!','⚠️');return;}
  const t={name,subject:document.getElementById('tf-subject').value,exp:document.getElementById('tf-exp').value,phone:document.getElementById('tf-phone').value,qual:document.getElementById('tf-qual').value,email:document.getElementById('tf-email').value};
  if(editTchIdx>=0)teachers[editTchIdx]=t;else teachers.push(t);
  save();closeModal('modal-teacher');renderTeachers();
  showToast(editTchIdx>=0?'Macallin waa la cusbooneysiiyay':'Macallin cusub waa la daray','✅');
}

// GRADES
function populateGradeSelects(){
  ['grade-student','result-student'].forEach(id=>{
    const sel=document.getElementById(id);
    const cur=sel.value;
    sel.innerHTML=students.map((s,i)=>`<option value="${i}">${s.name} (${s.grade})</option>`).join('');
    if(cur)sel.value=cur;
  });
}
function getLetter(score){
  if(score>=90)return{l:'A+',c:'#00d4aa'};
  if(score>=80)return{l:'A',c:'#00d4aa'};
  if(score>=70)return{l:'B',c:'#8ab4f8'};
  if(score>=60)return{l:'C',c:'#f5a623'};
  if(score>=50)return{l:'D',c:'#f5a623'};
  return{l:'F',c:'#ff6b6b'};
}
function renderGradeTable(){
  const idx=document.getElementById('grade-student').value;
  const sid=students[idx]?.id;
  const sg=grades[sid]||{};
  document.getElementById('grade-body').innerHTML=SUBJECTS.map(s=>{
    const v=sg[s]||'';
    const g=v?getLetter(Number(v)):{l:'—',c:'var(--muted)'};
    const key=s.replace(/\s/g,'_');
    return `<tr><td>${s}</td>
      <td><input type="number" min="0" max="100" value="${v}" id="g-${key}" oninput="liveGrade('${key}',this.value)"></td>
      <td><span class="grade-letter" style="color:${g.c}" id="gl-${key}">${g.l}</span></td></tr>`;
  }).join('');
}
function liveGrade(key,val){
  const g=getLetter(Number(val));
  const el=document.getElementById('gl-'+key);
  if(el){el.textContent=val?g.l:'—';el.style.color=val?g.c:'var(--muted)';}
}
function saveGrades(){
  const idx=document.getElementById('grade-student').value;
  const sid=students[idx]?.id;
  if(!sid)return;
  if(!grades[sid])grades[sid]={};
  SUBJECTS.forEach(s=>{
    const inp=document.getElementById('g-'+s.replace(/\s/g,'_'));
    if(inp)grades[sid][s]=inp.value;
  });
  save();renderResultTable();showToast('Dhibcaha waa la keydiay','✅');
}
function renderResultTable(){
  const idx=document.getElementById('result-student').value;
  const sid=students[idx]?.id;
  const sg=grades[sid]||{};
  document.getElementById('result-body').innerHTML=SUBJECTS.map(s=>{
    const v=sg[s];
    const g=v?getLetter(Number(v)):{l:'—',c:'var(--muted)'};
    return `<tr><td>${s}</td><td style="font-weight:600">${v||'—'}</td><td><span class="grade-letter" style="color:${g.c}">${g.l}</span></td></tr>`;
  }).join('');
}

// ATTENDANCE
function renderAttendance(){
  const gf=document.getElementById('att-filter').value;
  const today=new Date().toDateString();
  if(!attendance[today])attendance[today]={};
  const list=students.filter(s=>!gf||s.grade===gf);
  document.getElementById('att-grid').innerHTML=list.map(s=>{
    const cur=attendance[today][s.id]||'';
    return `<div class="att-card">
      <div class="att-name">${s.name}</div>
      <div class="att-grade-lbl">${s.grade}</div>
      <div class="att-status-btns">
        <button class="att-btn att-btn-p ${cur==='Xaadir'?'sel':''}" onclick="markAtt('${s.id}','Xaadir',this)">✓</button>
        <button class="att-btn att-btn-a ${cur==='Maqan'?'sel':''}" onclick="markAtt('${s.id}','Maqan',this)">✕</button>
        <button class="att-btn att-btn-l ${cur==='Daahsanaa'?'sel':''}" onclick="markAtt('${s.id}','Daahsanaa',this)">⏰</button>
      </div>
    </div>`;
  }).join('');
}
function markAtt(sid,status,btn){
  const today=new Date().toDateString();
  if(!attendance[today])attendance[today]={};
  attendance[today][sid]=status;
  const s=students.find(s=>s.id===sid);
  if(s)s.status=status;
  const card=btn.closest('.att-card');
  card.querySelectorAll('.att-btn').forEach(b=>b.classList.remove('sel'));
  btn.classList.add('sel');
}
function saveAttendance(){save();updateKPIs();showToast('Xaadirada waa la keydiay','✅');}

// TIMETABLE
function renderTimetable(){
  const t=document.getElementById('tt-table');
  t.innerHTML='<thead><tr><th>Waqtiga</th>'+DAYS.map(d=>`<th>${d}</th>`).join('')+'</tr></thead><tbody>'+
    TIMES.map((time,i)=>'<tr><td style="color:var(--muted);font-size:.75rem;white-space:nowrap;font-weight:500">'+time+'</td>'+
      DAYS.map((_,j)=>{
        const c=TT[i][j];
        return `<td><div class="${c.includes('Nasasho')?'tt-break':'tt-cell'}">${c}</div></td>`;
      }).join('')+'</tr>'
    ).join('')+'</tbody>';
}

// REPORTS
function renderReports(){
  // Bar chart
  const avgS=SUBJECTS.map(s=>{
    const vals=students.map(st=>grades[st.id]&&grades[st.id][s]?Number(grades[st.id][s]):null).filter(v=>v!==null);
    return vals.length?Math.round(vals.reduce((a,b)=>a+b,0)/vals.length):Math.floor(55+Math.random()*35);
  });
  document.getElementById('rpt-bars').innerHTML=SUBJECTS.map((s,i)=>
    `<div class="bar-row"><span class="bar-subject">${s}</span><div class="bar-bg"><div class="bar-fill" style="width:${avgS[i]}%"></div></div><span class="bar-val">${avgS[i]}</span></div>`
  ).join('');

  // Donut
  const gd={A:0,B:0,C:0,D:0,F:0};
  students.forEach(st=>{const sg=grades[st.id]||{};SUBJECTS.forEach(s=>{if(sg[s])gd[getLetter(Number(sg[s])).l.replace('+','')]++;});});
  const tot=Object.values(gd).reduce((a,b)=>a+b,0)||1;
  const cols={A:'#00d4aa',B:'#8ab4f8',C:'#f5a623',D:'#d4a8f8',F:'#ff6b6b'};
  const r=38,cx=55,cy=55,circ=2*Math.PI*r;
  let off=0;
  const svg=document.getElementById('donut-svg');
  svg.innerHTML='';
  Object.entries(gd).forEach(([k,v])=>{
    if(!v)return;
    const p=v/tot,dash=p*circ,gap=circ-dash;
    const el=document.createElementNS('http://www.w3.org/2000/svg','circle');
    el.setAttribute('cx',cx);el.setAttribute('cy',cy);el.setAttribute('r',r);
    el.setAttribute('fill','none');el.setAttribute('stroke',cols[k]);el.setAttribute('stroke-width','14');
    el.setAttribute('stroke-dasharray',`${dash} ${gap}`);
    el.setAttribute('stroke-dashoffset',-off*circ);
    el.setAttribute('transform',`rotate(-90 ${cx} ${cy})`);
    svg.appendChild(el);off+=p;
  });
  document.getElementById('donut-legend').innerHTML=Object.entries(gd).map(([k,v])=>
    `<div class="legend-item"><div class="legend-dot" style="background:${cols[k]}"></div><span style="color:var(--muted)">${k}:</span><span style="font-weight:600;margin-left:.3rem">${v}</span></div>`
  ).join('');

  // Att bars
  const today=new Date().toDateString();
  const ta=attendance[today]||{};
  document.getElementById('rpt-att').innerHTML=['Grade 9','Grade 10','Grade 11','Grade 12'].map(g=>{
    const gs=students.filter(s=>s.grade===g);
    const p=gs.length?Math.round(gs.filter(s=>ta[s.id]==='Xaadir').length/gs.length*100):0;
    return `<div class="att-bar-wrap"><div class="att-bar-top"><span class="att-bar-label">${g}</span><span class="att-bar-pct">${p}%</span></div><div class="att-bar-bg"><div class="att-bar-fill" style="width:${p}%"></div></div></div>`;
  }).join('');

  // Quick stats
  const allS=[];students.forEach(st=>{const sg=grades[st.id]||{};SUBJECTS.forEach(s=>{if(sg[s])allS.push(Number(sg[s]));});});
  const avg=allS.length?Math.round(allS.reduce((a,b)=>a+b,0)/allS.length):0;
  document.getElementById('rpt-quick').innerHTML=[
    ['Ardayda Guud',students.length],['Macallimiin',teachers.length],
    ['Celceliska Dhibcaha',avg||'—'],['Dhibco Gudbay (≥50)',allS.filter(v=>v>=50).length],
    ['Dhibco Waayo (<50)',allS.filter(v=>v<50).length],
  ].map(([l,v])=>`<div class="quick-stat"><span class="qs-label">${l}</span><span class="qs-val">${v}</span></div>`).join('');
}

// EXPORT
function exportReport(){
  const blob=new Blob([JSON.stringify({students,teachers,grades,attendance,date:new Date().toISOString()},null,2)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='yamees-school-report.json';a.click();
  showToast('Warbixinta waa la soo dejiyay','📥');
}

// MODAL
function closeModal(id){document.getElementById(id).classList.remove('open');}
document.querySelectorAll('.modal-overlay').forEach(m=>m.addEventListener('click',function(e){if(e.target===this)this.classList.remove('open');}));

// TOAST
function showToast(msg,icon='✅'){
  const t=document.getElementById('toast');
  t.innerHTML=icon+' '+msg;t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),2800);
}

// INIT
updateKPIs();
