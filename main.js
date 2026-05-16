* ────────────────────────────────────────
   UTILITIES
──────────────────────────────────────── */
const $  = id => document.getElementById(id);
const qs = s  => document.querySelector(s);

function toast(msg, icon='✅'){
  $('tMsg').textContent=msg; $('tIcon').textContent=icon;
  const t=$('toast'); t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),3000);
}
function save(k,v){localStorage.setItem(k,JSON.stringify(v))}
function load(k,d){try{return JSON.parse(localStorage.getItem(k))||d}catch{return d}}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}

/* ────────────────────────────────────────
   NAVIGATION
──────────────────────────────────────── */
$('ham').onclick=()=>$('mobMenu').classList.toggle('open');
document.querySelectorAll('.mob-menu a').forEach(a=>a.addEventListener('click',()=>$('mobMenu').classList.remove('open')));
const secs=document.querySelectorAll('section');
const navAs=document.querySelectorAll('.nav-links a');
window.addEventListener('scroll',()=>{
  let cur='';
  secs.forEach(s=>{if(window.scrollY>=s.offsetTop-160)cur=s.id});
  navAs.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+cur));
});

/* ────────────────────────────────────────
   DATA STORE
──────────────────────────────────────── */
const COLORS=['#1e88e5','#00c896','#ff8c42','#ff5252','#ffd740','#ab47bc','#26c6da'];
const AVATARBG=['#1e3a5f','#1a3d2e','#3d2a1a','#3d1a1a','#2a3d1a','#2a1a3d','#1a2a3d'];

let students = load('em_students', [
  {id:'STU-001',name:'Faadumo Xasan',grade:'Grade 10',gender:'Female',age:16,phone:'+252612345',scores:{Mathematics:82,English:75,Science:90,History:70,'Islamic Studies':88,'Physical Ed.':95},att:{present:18,absent:2,late:1}},
  {id:'STU-002',name:'Axmed Yuusuf',grade:'Grade 10',gender:'Male',age:16,phone:'+252618000',scores:{Mathematics:91,English:85,Science:78,History:83,'Islamic Studies':92,'Physical Ed.':88},att:{present:20,absent:0,late:1}},
  {id:'STU-003',name:'Xaliimo Nuur',grade:'Grade 11',gender:'Female',age:17,phone:'+252617111',scores:{Mathematics:65,English:70,Science:60,History:74,'Islamic Studies':80,'Physical Ed.':77},att:{present:15,absent:5,late:2}},
  {id:'STU-004',name:'Cabdullahi Warsame',grade:'Grade 9',gender:'Male',age:15,phone:'+252615222',scores:{Mathematics:55,English:62,Science:58,History:60,'Islamic Studies':72,'Physical Ed.':80},att:{present:17,absent:3,late:3}},
  {id:'STU-005',name:'Saado Cali',grade:'Grade 12',gender:'Female',age:18,phone:'+252611333',scores:{Mathematics:95,English:92,Science:97,History:89,'Islamic Studies':96,'Physical Ed.':91},att:{present:21,absent:0,late:0}},
]);

let teachers = load('em_teachers', [
  {id:'T001',name:'Maxamed Siciid',subject:'Mathematics',exp:'8 years',phone:'+252613100',qual:'M.Ed',email:'math@school.edu'},
  {id:'T002',name:'Filsan Abukar',subject:'English',exp:'5 years',phone:'+252614200',qual:'B.Ed',email:'eng@school.edu'},
  {id:'T003',name:'Cabdi Raxmaan',subject:'Science',exp:'10 years',phone:'+252615300',qual:'PhD',email:'sci@school.edu'},
  {id:'T004',name:'Nasra Jaamac',subject:'History',exp:'6 years',phone:'+252616400',qual:'B.Ed',email:'hist@school.edu'},
  {id:'T005',name:'Sheekh Nuux',subject:'Islamic Studies',exp:'12 years',phone:'+252617500',qual:'M.Ed',email:'isl@school.edu'},
  {id:'T006',name:'Khadiijo Muuse',subject:'Physical Ed.',exp:'4 years',phone:'+252618600',qual:'Diploma',email:'pe@school.edu'},
]);

const SUBJECTS=['Mathematics','English','Science','History','Islamic Studies','Physical Ed.'];

let editStuId=null, editTchId=null;

/* ────────────────────────────────────────
   KPIs
──────────────────────────────────────── */
function updateKPIs(){
  $('kpiStudents').textContent=students.length;
  $('kpiTeachers').textContent=teachers.length;
  // avg attendance
  if(!students.length){$('kpiAttendance').textContent='—';return}
  const avg=students.reduce((s,st)=>{
    const total=st.att.present+st.att.absent+st.att.late||1;
    return s+(st.att.present/total*100);
  },0)/students.length;
  $('kpiAttendance').textContent=Math.round(avg)+'%';
}

/* ────────────────────────────────────────
   STUDENTS
──────────────────────────────────────── */
function renderStudents(){
  const q=$('stuSearch').value.toLowerCase();
  const gf=$('stuFilter').value;
  let rows=students.filter(s=>{
    const match=s.name.toLowerCase().includes(q)||s.id.toLowerCase().includes(q);
    const gMatch=!gf||s.grade===gf;
    return match&&gMatch;
  });
  const tb=$('stuBody');
  if(!rows.length){
    tb.innerHTML=`<tr class="empty-row"><td colspan="7">No students found.</td></tr>`;return;
  }
  tb.innerHTML=rows.map((s,i)=>{
    const avg=SUBJECTS.reduce((a,sub)=>a+(s.scores[sub]||0),0)/SUBJECTS.length;
    const letter=gradeL(avg);
    const total=s.att.present+s.att.absent+s.att.late||1;
    const attPct=Math.round(s.att.present/total*100);
    const status=attPct>=80?'Active':'At Risk';
    return `<tr style="animation:slideIn .3s ${i*.04}s ease both;opacity:0;animation-fill-mode:forwards">
      <td>
        <div class="stu-name-cell">
          <div class="stu-avatar" style="background:${AVATARBG[i%AVATARBG.length]}">${s.name.charAt(0)}</div>
          <div><div class="stu-name">${esc(s.name)}</div><div class="stu-id">${esc(s.id)}</div></div>
        </div>
      </td>
      <td><span class="badge badge-blue">${esc(s.grade)}</span></td>
      <td>${esc(s.gender)}, ${s.age}y</td>
      <td><span class="grade-pill g-${letter}">${Math.round(avg)}% — ${letter}</span></td>
      <td><span class="${attPct>=80?'badge badge-green':'badge badge-orange'}">${attPct}%</span></td>
      <td><span class="${status==='Active'?'badge badge-green':'badge badge-red'}">${status}</span></td>
      <td><div class="actions-cell">
        <button class="btn-icon btn-edit" onclick="editStudent('${s.id}')" title="Edit">✏️</button>
        <button class="btn-icon btn-del" onclick="deleteStudent('${s.id}')" title="Delete">🗑</button>
      </div></td>
    </tr>`;
  }).join('');
}

function gradeL(score){
  if(score>=90)return'A';if(score>=80)return'B';
  if(score>=70)return'C';if(score>=60)return'D';return'F';
}

function openStudentModal(id=null){
  editStuId=id;
  $('stuModalTitle').textContent=id?'Edit Student':'Add Student';
  if(id){
    const s=students.find(x=>x.id===id);
    $('sf-name').value=s.name;$('sf-id').value=s.id;
    $('sf-grade').value=s.grade;$('sf-gender').value=s.gender;
    $('sf-age').value=s.age;$('sf-phone').value=s.phone;
  } else {
    ['sf-name','sf-id','sf-age','sf-phone'].forEach(f=>$(f).value='');
  }
  $('stuModal').classList.add('open');
}

function editStudent(id){openStudentModal(id)}

function saveStudent(){
  const name=$('sf-name').value.trim();
  const sid=$('sf-id').value.trim();
  if(!name){toast('Name is required!','⚠️');return}
  if(!sid){toast('Student ID is required!','⚠️');return}

  if(editStuId){
    const s=students.find(x=>x.id===editStuId);
    s.name=name;s.id=sid;s.grade=$('sf-grade').value;
    s.gender=$('sf-gender').value;s.age=+$('sf-age').value||15;s.phone=$('sf-phone').value.trim();
  } else {
    students.push({
      id:sid,name,grade:$('sf-grade').value,gender:$('sf-gender').value,
      age:+$('sf-age').value||15,phone:$('sf-phone').value.trim(),
      scores:Object.fromEntries(SUBJECTS.map(s=>[s,Math.floor(Math.random()*40+55)])),
      att:{present:Math.floor(Math.random()*5+15),absent:Math.floor(Math.random()*3),late:Math.floor(Math.random()*2)}
    });
  }
  save('em_students',students);
  closeModal('stuModal');
  renderStudents();updateKPIs();renderGradeDropdowns();renderReports();
  toast(editStuId?'Student updated!':'Student added!','✅');
}

function deleteStudent(id){
  if(!confirm('Delete this student?'))return;
  students=students.filter(s=>s.id!==id);
  save('em_students',students);
  renderStudents();updateKPIs();renderGradeDropdowns();renderReports();
  toast('Student deleted','🗑️');
}

$('stuSearch').addEventListener('input',renderStudents);
$('stuFilter').addEventListener('change',renderStudents);

/* ────────────────────────────────────────
   TEACHERS
──────────────────────────────────────── */
function renderTeachers(){
  const q=$('tchSearch').value.toLowerCase();
  const filtered=teachers.filter(t=>t.name.toLowerCase().includes(q)||t.subject.toLowerCase().includes(q));
  $('teachersGrid').innerHTML = filtered.length ? filtered.map((t,i)=>`
    <div class="card teacher-card" style="animation:fadeUp .4s ${i*.06}s ease both">
      <div class="teacher-avatar" style="background:${AVATARBG[i%AVATARBG.length]}">${t.name.charAt(0)}</div>
      <div class="teacher-name">${esc(t.name)}</div>
      <div class="teacher-sub">${esc(t.subject)}</div>
      <div class="teacher-meta">
        <span class="badge badge-blue">${esc(t.qual)}</span>
        <span class="badge badge-green">${esc(t.exp)}</span>
      </div>
      <div style="font-size:.75rem;color:var(--muted);margin-top:.25rem">${esc(t.email)}</div>
      <div class="teacher-actions">
        <button class="btn-icon btn-edit" onclick="editTeacher('${t.id}')">✏️</button>
        <button class="btn-icon btn-del" onclick="deleteTeacher('${t.id}')">🗑</button>
      </div>
    </div>
  `).join('') : '<p style="color:var(--muted)">No teachers found.</p>';
}

function openTeacherModal(id=null){
  editTchId=id;
  $('tchModalTitle').textContent=id?'Edit Teacher':'Add Teacher';
  if(id){
    const t=teachers.find(x=>x.id===id);
    $('tf-name').value=t.name;$('tf-subject').value=t.subject;
    $('tf-exp').value=t.exp;$('tf-phone').value=t.phone;
    $('tf-qual').value=t.qual;$('tf-email').value=t.email;
  } else {
    ['tf-name','tf-exp','tf-phone','tf-email'].forEach(f=>$(f).value='');
  }
  $('tchModal').classList.add('open');
}

function editTeacher(id){openTeacherModal(id)}

function saveTeacher(){
  const name=$('tf-name').value.trim();
  if(!name){toast('Name is required!','⚠️');return}
  if(editTchId){
    const t=teachers.find(x=>x.id===editTchId);
    t.name=name;t.subject=$('tf-subject').value;t.exp=$('tf-exp').value.trim();
    t.phone=$('tf-phone').value.trim();t.qual=$('tf-qual').value;t.email=$('tf-email').value.trim();
  } else {
    teachers.push({
      id:'T'+String(Date.now()).slice(-4),name,subject:$('tf-subject').value,
      exp:$('tf-exp').value.trim()||'1 year',phone:$('tf-phone').value.trim(),
      qual:$('tf-qual').value,email:$('tf-email').value.trim()
    });
  }
  save('em_teachers',teachers);
  closeModal('tchModal');
  renderTeachers();updateKPIs();
  toast(editTchId?'Teacher updated!':'Teacher added!','✅');
}

function deleteTeacher(id){
  if(!confirm('Delete this teacher?'))return;
  teachers=teachers.filter(t=>t.id!==id);
  save('em_teachers',teachers);
  renderTeachers();updateKPIs();
  toast('Teacher removed','🗑️');
}

$('tchSearch').addEventListener('input',renderTeachers);

/* ────────────────────────────────────────
   GRADES & ATTENDANCE
──────────────────────────────────────── */
function renderGradeDropdowns(){
  const opts=students.map(s=>`<option value="${esc(s.id)}">${esc(s.name)}</option>`).join('');
  $('gradeStudent').innerHTML=opts||'<option>No students</option>';
  $('attStudent').innerHTML=opts||'<option>No students</option>';
  renderGradeTable();renderAttendance();
}

function renderGradeTable(){
  const sid=$('gradeStudent').value;
  const stu=students.find(s=>s.id===sid);
  if(!stu){$('gradeBody').innerHTML='';return}
  $('gradeBody').innerHTML=SUBJECTS.map(sub=>{
    const sc=stu.scores[sub]||'';
    const ltr=sc?gradeL(sc):'—';
    return `<tr>
      <td>${sub}</td>
      <td><input type="number" class="score-inp" min="0" max="100" value="${sc}" id="sc-${sub.replace(/\s/g,'_')}" oninput="updateGradeLive(this,'gl-${sub.replace(/\s/g,'_')}')"></td>
      <td><span class="grade-pill g-${ltr}" id="gl-${sub.replace(/\s/g,'_')}">${ltr}</span></td>
    </tr>`;
  }).join('');
}

function updateGradeLive(inp,glId){
  const v=+inp.value;
  const l=v>0?gradeL(v):'—';
  const el=$(glId);if(el){el.textContent=l;el.className=`grade-pill g-${l}`}
}

function saveGrades(){
  const sid=$('gradeStudent').value;
  const stu=students.find(s=>s.id===sid);
  if(!stu)return;
  SUBJECTS.forEach(sub=>{
    const key=sub.replace(/\s/g,'_');
    const val=+($('sc-'+key)?.value||0);
    if(val>=0&&val<=100)stu.scores[sub]=val;
  });
  save('em_students',students);
  renderStudents();renderReports();
  toast('Scores saved!','💾');
}

function renderAttendance(){
  const sid=$('attStudent').value;
  const stu=students.find(s=>s.id===sid);
  if(!stu){$('attBars').innerHTML='';return}
  const total=stu.att.present+stu.att.absent+stu.att.late||1;
  const rows=[
    {label:'Present',val:stu.att.present,color:'var(--green)'},
    {label:'Absent', val:stu.att.absent, color:'var(--red)'},
    {label:'Late',   val:stu.att.late,   color:'var(--yellow)'},
  ];
  $('attBars').innerHTML=rows.map(r=>`
    <div class="att-item">
      <div class="att-label">
        <span>${r.label}</span>
        <span style="font-weight:600">${r.val} days (${Math.round(r.val/total*100)}%)</span>
      </div>
      <div class="att-bar"><div class="att-fill" style="width:${Math.round(r.val/total*100)}%;background:${r.color}"></div></div>
    </div>
  `).join('');
}

function markAtt(type){
  const sid=$('attStudent').value;
  const stu=students.find(s=>s.id===sid);
  if(!stu)return;
  stu.att[type]=(stu.att[type]||0)+1;
  save('em_students',students);
  renderAttendance();updateKPIs();renderReports();
  const msgs={present:'Marked Present ✅',absent:'Marked Absent ❌',late:'Marked Late ⏰'};
  $('attMsg').textContent=msgs[type];
  setTimeout(()=>$('attMsg').textContent='',3000);
  toast(msgs[type]);
}

$('gradeStudent').addEventListener('change',renderGradeTable);

/* ────────────────────────────────────────
   TIMETABLE
──────────────────────────────────────── */
const TT_DAYS=['Mon','Tue','Wed','Thu','Fri'];
const TT_TIMES=['8:00 AM','9:00 AM','10:00 AM','11:00 AM','11:30 AM','12:30 PM','1:30 PM'];
const TT_DATA=[
  // [Mon,Tue,Wed,Thu,Fri]
  [{sub:'Mathematics',teacher:'Maxamed',room:'101',col:'blue'},{sub:'English',teacher:'Filsan',room:'203',col:'green'},{sub:'Science',teacher:'Cabdi',room:'Lab 1',col:'orange'},{sub:'Mathematics',teacher:'Maxamed',room:'101',col:'blue'},{sub:'ICT',teacher:'Staff',room:'Lab 2',col:'yellow'}],
  [{sub:'English',teacher:'Filsan',room:'203',col:'green'},{sub:'Science',teacher:'Cabdi',room:'Lab 1',col:'orange'},{sub:'History',teacher:'Nasra',room:'105',col:'yellow'},{sub:'English',teacher:'Filsan',room:'203',col:'green'},{sub:'Mathematics',teacher:'Maxamed',room:'101',col:'blue'}],
  [{sub:'Science',teacher:'Cabdi',room:'Lab 1',col:'orange'},{sub:'Mathematics',teacher:'Maxamed',room:'101',col:'blue'},null,{sub:'Islamic Studies',teacher:'Sheekh',room:'202',col:'green'},{sub:'History',teacher:'Nasra',room:'105',col:'yellow'}],
  [{sub:'Break ☕',teacher:'—',room:'—',col:''},null,null,null,null],
  [{sub:'History',teacher:'Nasra',room:'105',col:'yellow'},{sub:'Islamic Studies',teacher:'Sheekh',room:'202',col:'green'},{sub:'Mathematics',teacher:'Maxamed',room:'101',col:'blue'},{sub:'Science',teacher:'Cabdi',room:'Lab 1',col:'orange'},{sub:'English',teacher:'Filsan',room:'203',col:'green'}],
  [{sub:'Islamic Studies',teacher:'Sheekh',room:'202',col:'green'},{sub:'History',teacher:'Nasra',room:'105',col:'yellow'},{sub:'English',teacher:'Filsan',room:'203',col:'green'},{sub:'Physical Ed.',teacher:'Khadiijo',room:'Field',col:'red'},{sub:'Science',teacher:'Cabdi',room:'Lab 1',col:'orange'}],
  [{sub:'Physical Ed.',teacher:'Khadiijo',room:'Field',col:'red'},{sub:'Physical Ed.',teacher:'Khadiijo',room:'Field',col:'red'},{sub:'Islamic Studies',teacher:'Sheekh',room:'202',col:'green'},{sub:'English',teacher:'Filsan',room:'203',col:'green'},{sub:'Physical Ed.',teacher:'Khadiijo',room:'Field',col:'red'}],
];

function renderTimetable(){
  let html='';
  // header row
  html+=`<div class="tt-head"></div>`;
  TT_DAYS.forEach(d=>html+=`<div class="tt-head">${d}</div>`);
  // rows
  TT_TIMES.forEach((time,ri)=>{
    html+=`<div class="tt-time">${time}</div>`;
    TT_DAYS.forEach((_,ci)=>{
      const cell=TT_DATA[ri]?.[ci];
      if(!cell)html+=`<div class="tt-cell tt-empty"></div>`;
      else html+=`<div class="tt-cell ${cell.col}">
        <div class="tt-subject">${cell.sub}</div>
        <div class="tt-teacher">${cell.teacher}</div>
        <div class="tt-room">${cell.room}</div>
      </div>`;
    });
  });
  $('ttGrid').innerHTML=html;
}

/* ────────────────────────────────────────
   REPORTS
──────────────────────────────────────── */
function renderReports(){
  renderSubjectBars();renderDonut();renderAttGrade();renderQuickStats();
}

function renderSubjectBars(){
  if(!students.length){$('subjectBarChart').innerHTML='<span style="color:var(--muted)">No data</span>';return}
  const avgs=SUBJECTS.map(sub=>{
    const sum=students.reduce((a,s)=>a+(s.scores[sub]||0),0);
    return{sub,avg:Math.round(sum/students.length)};
  });
  const max=Math.max(...avgs.map(a=>a.avg),1);
  $('subjectBarChart').innerHTML=avgs.map((a,i)=>`
    <div class="bar-col">
      <div class="bar" style="height:${Math.round(a.avg/max*100)}px;background:linear-gradient(180deg,${COLORS[i]},${COLORS[i]}55)" title="${a.sub}: ${a.avg}%"></div>
      <span class="bar-lbl">${a.sub.split(' ')[0]}</span>
    </div>
  `).join('');
}

function renderDonut(){
  const dist={A:0,B:0,C:0,D:0,F:0};
  students.forEach(s=>{
    const avg=SUBJECTS.reduce((a,sub)=>a+(s.scores[sub]||0),0)/SUBJECTS.length;
    dist[gradeL(avg)]++;
  });
  const colors={A:'#00c896',B:'#1e88e5',C:'#ffd740',D:'#ff8c42',F:'#ff5252'};
  const total=students.length||1;
  let offset=0;
  const r=35,cx=50,cy=50,paths=[];
  Object.entries(dist).forEach(([g,cnt])=>{
    if(!cnt)return;
    const pct=cnt/total;const angle=pct*360;
    const large=angle>180?1:0;
    const s1=(offset-90)*Math.PI/180,e1=(offset+angle-90)*Math.PI/180;
    const x1=cx+r*Math.cos(s1),y1=cy+r*Math.sin(s1);
    const x2=cx+r*Math.cos(e1),y2=cy+r*Math.sin(e1);
    paths.push(`<path d="M${cx},${cy} L${x1.toFixed(1)},${y1.toFixed(1)} A${r},${r} 0 ${large},1 ${x2.toFixed(1)},${y2.toFixed(1)} Z" fill="${colors[g]}88" stroke="${colors[g]}" stroke-width="1"/>`);
    offset+=angle;
  });
  $('donutSvg').innerHTML=paths.join('');
  $('donutLegend').innerHTML=Object.entries(dist).map(([g,cnt])=>
    `<div class="leg-item"><div class="leg-dot" style="background:${colors[g]}"></div>Grade ${g}: ${cnt}</div>`
  ).join('');
}

function renderAttGrade(){
  const grades=['Grade 9','Grade 10','Grade 11','Grade 12'];
  const colors=['var(--blue)','var(--green)','var(--orange)','var(--red)'];
  $('attGradeChart').innerHTML=grades.map((g,i)=>{
    const grp=students.filter(s=>s.grade===g);
    if(!grp.length)return`<div class="prog-item"><div class="prog-label"><span>${g}</span><span style="color:var(--muted)">No data</span></div><div class="prog-bar"><div class="prog-fill" style="width:0%;background:${colors[i]}"></div></div></div>`;
    const avg=grp.reduce((a,s)=>{const t=s.att.present+s.att.absent+s.att.late||1;return a+s.att.present/t*100},0)/grp.length;
    return`<div class="prog-item"><div class="prog-label"><span>${g}</span><span style="font-weight:600">${Math.round(avg)}%</span></div><div class="prog-bar"><div class="prog-fill" style="width:${Math.round(avg)}%;background:${colors[i]}"></div></div></div>`;
  }).join('');
}

function renderQuickStats(){
  if(!students.length){$('quickStats').innerHTML='<p style="color:var(--muted)">No data yet.</p>';return}
  const avgScore=students.reduce((a,s)=>a+SUBJECTS.reduce((b,sub)=>b+(s.scores[sub]||0),0)/SUBJECTS.length,0)/students.length;
  const top=students.reduce((a,s)=>{const avg=SUBJECTS.reduce((b,sub)=>b+(s.scores[sub]||0),0)/SUBJECTS.length;return avg>a.avg?{name:s.name,avg}:a},{name:'—',avg:0});
  const failing=students.filter(s=>SUBJECTS.reduce((a,sub)=>a+(s.scores[sub]||0),0)/SUBJECTS.length<60).length;
  const total=students.reduce((a,s)=>a+s.att.present+s.att.absent+s.att.late,0)||1;
  const present=students.reduce((a,s)=>a+s.att.present,0);
  $('quickStats').innerHTML=`
    <div class="stat-row"><span>Class Average</span><span class="stat-row-val">${Math.round(avgScore)}%</span></div>
    <div class="stat-row"><span>Top Student</span><span class="stat-row-val" style="font-size:.8rem;font-family:'Plus Jakarta Sans'">${esc(top.name)}</span></div>
    <div class="stat-row"><span>At Risk (below 60%)</span><span class="stat-row-val" style="color:var(--red)">${failing}</span></div>
    <div class="stat-row"><span>Avg Attendance</span><span class="stat-row-val" style="color:var(--green)">${Math.round(present/total*100)}%</span></div>
    <div class="stat-row"><span>Total Students</span><span class="stat-row-val">${students.length}</span></div>
    <div class="stat-row"><span>Total Teachers</span><span class="stat-row-val">${teachers.length}</span></div>
  `;
}

/* ────────────────────────────────────────
   EXPORT & PRINT
──────────────────────────────────────── */
function exportReport(){
  const data={school:'EduManage',exportDate:new Date().toISOString(),students,teachers};
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=url;a.download='school-report.json';a.click();
  URL.revokeObjectURL(url);
  toast('Report exported!','📥');
}
function printPage(){window.print()}

/* ────────────────────────────────────────
   MODAL HELPERS
──────────────────────────────────────── */
function closeModal(id){$(id).classList.remove('open')}
document.querySelectorAll('.modal-overlay').forEach(m=>{
  m.addEventListener('click',e=>{if(e.target===m)m.classList.remove('open')});
});

/* ────────────────────────────────────────
   INIT
──────────────────────────────────────── */
function init(){
  updateKPIs();
  renderStudents();
  renderTeachers();
  renderGradeDropdowns();
  renderTimetable();
  renderReports();
}
init();
