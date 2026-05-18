let currentStep = 0;
let maxVisitedStep = 0;
let captchaCode = "";
const MAX_FILE_SIZE = 2 * 1024 * 1024;
const steps = Array.from(document.querySelectorAll(".form-step"));
const stepButtons = Array.from(document.querySelectorAll(".step"));
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const submitBtn = document.getElementById("submitBtn");
const form = document.getElementById("spmbForm");

function generateCaptcha(){
  captchaCode = Math.floor(100000 + Math.random()*900000).toString();
  const canvas = document.getElementById("captchaCanvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = "#fafbfd";
  ctx.fillRect(0,0,canvas.width,canvas.height);
  for(let i=0;i<12;i++){
    ctx.strokeStyle = i % 2 ? "#b7e3d4" : "#e7b3df";
    ctx.beginPath();
    ctx.moveTo(Math.random()*canvas.width, Math.random()*canvas.height);
    ctx.lineTo(Math.random()*canvas.width, Math.random()*canvas.height);
    ctx.stroke();
  }
  ctx.font = "bold 46px Georgia";
  ctx.fillStyle = "#101923";
  ctx.letterSpacing = "8px";
  const chars = captchaCode.split("");
  chars.forEach((ch,i)=>{
    ctx.save();
    ctx.translate(18+i*36, 45);
    ctx.rotate((Math.random()-.5)*.28);
    ctx.fillText(ch,0,0);
    ctx.restore();
  });
}

function showStep(index){
  currentStep = index;
  maxVisitedStep = Math.max(maxVisitedStep, index);
  steps.forEach((section,i)=>section.classList.toggle("active", i===index));
  stepButtons.forEach((button,i)=>{
    button.classList.toggle("active", i===index);
    button.classList.toggle("done", i<index);
    if(i===index){
      button.setAttribute("aria-current", "step");
    }else{
      button.removeAttribute("aria-current");
    }
    button.disabled = i > maxVisitedStep + 1;
  });
  prevBtn.textContent = index === 0 ? "Batal" : "Sebelumnya";
  nextBtn.hidden = index === steps.length-1;
  submitBtn.hidden = index !== steps.length-1;
  if(index === steps.length-1) buildReview();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function getFormData(){
  const data = new FormData(form);
  const obj = {};
  for(const [key,value] of data.entries()){
    if(value instanceof File){
      obj[key] = value.name || "";
    } else {
      obj[key] = value;
    }
  }
  return obj;
}

function validateCurrentStep(){
  const visible = steps[currentStep];
  const controls = Array.from(visible.querySelectorAll("input, select, textarea"));
  const checkedRadioNames = new Set();

  for(const el of controls){
    if(el.type === "radio"){
      if(checkedRadioNames.has(el.name)) continue;
      checkedRadioNames.add(el.name);
      const group = visible.querySelectorAll(`[name="${el.name}"]`);
      if(el.required && !Array.from(group).some(r => r.checked)){
        group[0].focus();
        showToast("Mohon lengkapi pilihan yang wajib diisi.");
        return false;
      }
    } else if(el.type === "checkbox" && el.required){
      if(!el.checked){
        el.focus();
        showToast("Mohon centang pernyataan persetujuan.");
        return false;
      }
    } else if(el.type === "file"){
      if(!el.checkValidity()){
        el.focus();
        showToast("Mohon unggah berkas yang wajib.");
        return false;
      }
      if(Array.from(el.files).some(file => file.size > MAX_FILE_SIZE)){
        el.focus();
        showToast("Ukuran berkas maksimal 2 MB per file.");
        return false;
      }
    } else if(!el.checkValidity()){
      el.focus();
      el.reportValidity();
      showToast("Mohon periksa format kolom yang diisi.");
      return false;
    }
  }
  if(currentStep === 0){
    const cap = form.elements["captcha"].value.trim();
    if(cap !== captchaCode){
      form.elements["captcha"].focus();
      showToast("Kode keamanan belum sesuai.");
      generateCaptcha();
      return false;
    }
  }
  return true;
}

function buildReview(){
  const d = getFormData();
  const reviewBox = document.getElementById("reviewBox");
  reviewBox.replaceChildren(
    createReviewSection("Data Peserta", [
      ["NIK/SIDANIRA", d.nik],
      ["Nama Lengkap", d.nama],
      ["Jenis Kelamin", d.jk],
      ["Tempat/Tanggal Lahir", `${d.tempatLahir || "-"} / ${d.tanggalLahir || "-"}`],
      ["Sekolah Asal", d.sekolahAsal],
      ["Tahun Lulus", d.tahunLulus]
    ]),
    createReviewSection("Alamat", [
      ["Alamat", `${d.alamat || "-"}, RT ${d.rt || "-"} RW ${d.rw || "-"}`],
      ["Wilayah", `${d.kelurahan || "-"}, ${d.kecamatan || "-"}, ${d.kota || "-"}, ${d.provinsi || "-"}`],
      ["Kode Pos", d.kodePos]
    ]),
    createReviewSection("Orang Tua/Wali", [
      ["Ayah", `${d.namaAyah || "-"} - ${d.hpAyah || "-"}`],
      ["Ibu", `${d.namaIbu || "-"} - ${d.hpIbu || "-"}`],
      ["Transportasi", d.transport]
    ]),
    createReviewSection("Berkas", [
      ["Berkas", createFileList(d)]
    ])
  );
}

function createReviewSection(title, rows){
  const section = document.createElement("div");
  section.className = "review-section";

  const heading = document.createElement("h4");
  heading.textContent = title;

  const grid = document.createElement("div");
  grid.className = "review-grid";

  rows.forEach(([label, value]) => {
    const labelNode = document.createElement("span");
    const valueNode = document.createElement("span");
    labelNode.textContent = label;

    if(value instanceof Node){
      valueNode.appendChild(value);
    }else{
      valueNode.textContent = value || "-";
    }

    grid.append(labelNode, valueNode);
  });

  section.append(heading, grid);
  return section;
}

function createFileList(data){
  const list = document.createElement("ul");
  ["akta","kk","ktpOrtu","skl","foto"].forEach(key => {
    if(!data[key]) return;
    const item = document.createElement("li");
    item.textContent = `${labelOf(key)}: ${data[key]}`;
    list.appendChild(item);
  });

  if(!list.children.length){
    const item = document.createElement("li");
    item.textContent = "Belum ada file dipilih";
    list.appendChild(item);
  }

  return list;
}

function labelOf(key){
  return {
    akta:"Akta Kelahiran",
    kk:"Kartu Keluarga",
    ktpOrtu:"KTP Orang Tua/Wali",
    skl:"Ijazah/SKL",
    foto:"Pas Foto"
  }[key] || key;
}

function showToast(message){
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(()=>toast.classList.remove("show"), 2600);
}

function saveDraft(){
  const data = getFormData();
  delete data.captcha;
  localStorage.setItem("spmbDraft", JSON.stringify(data));
}

function loadDraft(){
  const raw = localStorage.getItem("spmbDraft");
  if(!raw) return;
  try{
    const d = JSON.parse(raw);
    Object.entries(d).forEach(([key,value])=>{
      const el = form.elements[key];
      if(!el || el.type === "file") return;
      if(el instanceof RadioNodeList){
        Array.from(el).forEach(r => r.checked = r.value === value);
      }else{
        el.value = value;
      }
    });
  }catch(e){}
}

function resetDemo(){
  localStorage.removeItem("spmbDraft");
  form.reset();
  generateCaptcha();
  updateUploadStates();
  maxVisitedStep = 0;
  showStep(0);
  showToast("Form dikosongkan kembali.");
}

prevBtn.addEventListener("click", ()=>{
  if(currentStep === 0){
    form.reset();
    generateCaptcha();
    updateUploadStates();
    maxVisitedStep = 0;
    showStep(0);
    showToast("Form dibatalkan.");
  }else{
    showStep(currentStep-1);
  }
});

nextBtn.addEventListener("click", ()=>{
  if(validateCurrentStep()){
    saveDraft();
    showStep(currentStep+1);
  }
});

stepButtons.forEach((btn,i)=>btn.addEventListener("click", ()=>{
  if(i <= maxVisitedStep){
    showStep(i);
  }else if(i === currentStep + 1 && validateCurrentStep()){
    saveDraft();
    showStep(i);
  }else{
    showToast("Selesaikan langkah sebelumnya terlebih dahulu.");
  }
}));

function updateUploadStates(){
  document.querySelectorAll(".upload-card").forEach(card => {
    const input = card.querySelector("input[type='file']");
    card.classList.toggle("selected", Boolean(input && input.files.length));
  });
}

document.querySelectorAll("input[type='file']").forEach(input => {
  input.addEventListener("change", updateUploadStates);
});

form.addEventListener("submit", (e)=>{
  e.preventDefault();
  if(!validateCurrentStep()) return;
  saveDraft();
  showToast("Pendaftaran berhasil dikirim. Silakan cetak bukti pendaftaran.");
  setTimeout(()=>window.print(), 800);
});

generateCaptcha();
loadDraft();
updateUploadStates();
showStep(0);