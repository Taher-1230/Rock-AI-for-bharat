import React, { useState } from 'react';
import { ArrowLeft, Check, School, Briefcase, Users, HeartHandshake, MapPin, Building2, Store, Search, User, ShieldCheck } from 'lucide-react';
import { ScreenName, UserProfile } from '../types';
import { Button } from '../components/Button';
import { t } from '../translations';

interface Props {
  onNavigate: (screen: ScreenName) => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  userProfile: UserProfile;
}

const steps = [
  { id: 'age', titleKey: 'w_age', progress: 15 },
  { id: 'state', titleKey: 'w_state', progress: 30 },
  { id: 'district', titleKey: 'w_district', progress: 50 },
  { id: 'occupation', titleKey: 'w_occupation', progress: 65 },
  { id: 'income', titleKey: 'w_income', progress: 80 },
  { id: 'category', titleKey: 'w_category', progress: 100 },
];

const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
  "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka",
  "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const STATE_DISTRICTS: { [key: string]: string[] } = {
  "Andhra Pradesh": ["Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna", "Kurnool", "Nellore", "Prakasam", "Srikakulam", "Visakhapatnam", "Vizianagaram", "West Godavari", "YSR Kadapa"],
  "Arunachal Pradesh": ["Tawang", "West Kameng", "East Kameng", "Papum Pare", "Kurung Kumey", "Kra Daadi", "Lower Subansiri", "Upper Subansiri", "West Siang", "East Siang", "Siang", "Upper Siang", "Lower Siang", "Lower Dibang Valley", "Dibang Valley", "Anjaw", "Lohit", "Namsai", "Changlang", "Tirap", "Longding"],
  "Assam": ["Baksa", "Barpeta", "Biswanath", "Bongaigaon", "Cachar", "Charaideo", "Chirang", "Darrang", "Dhemaji", "Dhubri", "Dibrugarh", "Dima Hasao", "Goalpara", "Golaghat", "Hailakandi", "Hojai", "Jorhat", "Kamrup", "Kamrup Metropolitan", "Karbi Anglong", "Karimganj", "Kokrajhar", "Lakhimpur", "Majuli", "Morigaon", "Nagaon", "Nalbari", "North Cachar Hills", "Sivasagar", "Sonitpur", "South Salmara-Mankachar", "Tinsukia", "Udalguri", "West Karbi Anglong"],
  "Bihar": ["Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur", "Buxar", "Darbhanga", "East Champaran", "Gaya", "Gopalganj", "Jamui", "Jehanabad", "Kaimur", "Katihar", "Khagaria", "Kishanganj", "Lakhisarai", "Madhepura", "Madhubani", "Munger", "Muzaffarpur", "Nalanda", "Nawada", "Patna", "Purnia", "Rohtas", "Saharsa", "Samastipur", "Saran", "Sheikhpura", "Sheohar", "Sitamarhi", "Siwan", "Supaul", "Vaishali", "West Champaran"],
  "Chhattisgarh": ["Balod", "Baloda Bazar", "Balrampur", "Bastar", "Bemetara", "Bijapur", "Bilaspur", "Dantewada", "Dhamtari", "Durg", "Gariaband", "Janjgir-Champa", "Jashpur", "Kabirdham", "Kanker", "Kondagaon", "Korba", "Koriya", "Mahasamund", "Mungeli", "Narayanpur", "Raigarh", "Raipur", "Rajnandgaon", "Sukma", "Surajpur", "Surguja"],
  "Goa": ["North Goa", "South Goa"],
  "Gujarat": ["Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch", "Bhavnagar", "Botad", "Chhota Udaipur", "Dahod", "Dang", "Devbhoomi Dwarka", "Gandhinagar", "Gir Somnath", "Jamnagar", "Junagadh", "Kheda", "Kutch", "Mahisagar", "Mehsana", "Morbi", "Narmada", "Navsari", "Panchmahal", "Patan", "Porbandar", "Rajkot", "Sabarkantha", "Surat", "Surendranagar", "Tapi", "Vadodara", "Valsad"],
  "Haryana": ["Ambala", "Bhiwani", "Charkhi Dadri", "Faridabad", "Fatehabad", "Gurugram", "Hisar", "Jhajjar", "Jind", "Kaithal", "Karnal", "Kurukshetra", "Mahendragarh", "Nuh", "Palwal", "Panchkula", "Panipat", "Rewari", "Rohtak", "Sirsa", "Sonipat", "Yamunanagar"],
  "Himachal Pradesh": ["Bilaspur", "Chamba", "Hamirpur", "Kangra", "Kinnaur", "Kullu", "Lahaul and Spiti", "Mandi", "Shimla", "Sirmaur", "Solan", "Una"],
  "Jharkhand": ["Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka", "East Singhbhum", "Garhwa", "Giridih", "Godda", "Gumla", "Hazaribagh", "Jamtara", "Khunti", "Koderma", "Latehar", "Lohardaga", "Pakur", "Palamu", "Ramgarh", "Ranchi", "Sahibganj", "Seraikela Kharsawan", "Simdega", "West Singhbhum"],
  "Karnataka": ["Bagalkot", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban", "Bidar", "Chamarajanagar", "Chikkaballapur", "Chikkamagaluru", "Chitradurga", "Dakshina Kannada", "Davangere", "Dharwad", "Gadag", "Hassan", "Haveri", "Kalaburagi", "Kodagu", "Kolar", "Koppal", "Mandya", "Mysuru", "Raichur", "Ramanagara", "Shivamogga", "Tumakuru", "Udupi", "Uttara Kannada", "Vijayapura", "Yadgir"],
  "Kerala": ["Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta", "Thiruvananthapuram", "Thrissur", "Wayanad"],
  "Madhya Pradesh": ["Agar Malwa", "Alirajpur", "Anuppur", "Ashoknagar", "Balaghat", "Barwani", "Betul", "Bhind", "Bhopal", "Burhanpur", "Chhatarpur", "Chhindwara", "Damoh", "Datia", "Dewas", "Dhar", "Dindori", "Guna", "Gwalior", "Harda", "Hoshangabad", "Indore", "Jabalpur", "Jhabua", "Katni", "Khandwa", "Khargone", "Mandla", "Mandsaur", "Morena", "Narsinghpur", "Neemuch", "Panna", "Raisen", "Rajgarh", "Ratlam", "Rewa", "Sagar", "Satna", "Sehore", "Seoni", "Shahdol", "Shajapur", "Sheopur", "Shivpuri", "Sidhi", "Singrauli", "Tikamgarh", "Ujjain", "Umaria", "Vidisha"],
  "Maharashtra": ["Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara", "Buldhana", "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded", "Nandurbar", "Nashik", "Osmanabad", "Palghar", "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"],
  "Manipur": ["Bishnupur", "Chandel", "Churachandpur", "Imphal East", "Imphal West", "Jiribam", "Kakching", "Kamjong", "Kangpokpi", "Noney", "Pherzawl", "Senapati", "Tamenglong", "Tengnoupal", "Thoubal", "Ukhrul"],
  "Meghalaya": ["East Garo Hills", "East Jaintia Hills", "East Khasi Hills", "North Garo Hills", "Ri Bhoi", "South Garo Hills", "South West Garo Hills", "South West Khasi Hills", "West Garo Hills", "West Jaintia Hills", "West Khasi Hills"],
  "Mizoram": ["Aizawl", "Champhai", "Kolasib", "Lawngtlai", "Lunglei", "Mamit", "Saiha", "Serchhip"],
  "Nagaland": ["Dimapur", "Kiphire", "Kohima", "Longleng", "Mokokchung", "Mon", "Peren", "Phek", "Tuensang", "Wokha", "Zunheboto"],
  "Odisha": ["Angul", "Balangir", "Balasore", "Bargarh", "Bhadrak", "Boudh", "Cuttack", "Deogarh", "Dhenkanal", "Gajapati", "Ganjam", "Jagatsinghpur", "Jajpur", "Jharsuguda", "Kalahandi", "Kandhamal", "Kendrapara", "Kendujhar", "Khordha", "Koraput", "Malkangiri", "Mayurbhanj", "Nabarangpur", "Nayagarh", "Nuapada", "Puri", "Rayagada", "Sambalpur", "Subarnapur", "Sundargarh"],
  "Punjab": ["Amritsar", "Barnala", "Bathinda", "Faridkot", "Fatehgarh Sahib", "Fazilka", "Ferozepur", "Gurdaspur", "Hoshiarpur", "Jalandhar", "Kapurthala", "Ludhiana", "Mansa", "Moga", "Muktsar", "Nawanshahr", "Pathankot", "Patiala", "Rupnagar", "Sahibzada Ajit Singh Nagar", "Sangrur", "Tarn Taran"],
  "Rajasthan": ["Ajmer", "Alwar", "Banswara", "Baran", "Barmer", "Bharatpur", "Bhilwara", "Bikaner", "Bundi", "Chittorgarh", "Churu", "Dausa", "Dholpur", "Dungarpur", "Hanumangarh", "Jaipur", "Jaisalmer", "Jalore", "Jhalawar", "Jhunjhunu", "Jodhpur", "Karauli", "Kota", "Nagaur", "Pali", "Pratapgarh", "Rajsamand", "Sawai Madhopur", "Sikar", "Sirohi", "Sri Ganganagar", "Tonk", "Udaipur"],
  "Sikkim": ["East Sikkim", "North Sikkim", "South Sikkim", "West Sikkim"],
  "Tamil Nadu": ["Ariyalur", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", "Salem", "Sivaganga", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"],
  "Telangana": ["Adilabad", "Bhadradri Kothagudem", "Hyderabad", "Jagtial", "Jangaon", "Jayashankar Bhupalpally", "Jogulamba Gadwal", "Kamareddy", "Karimnagar", "Khammam", "Komaram Bheem", "Mahabubabad", "Mahabubnagar", "Mancherial", "Medak", "Medchal", "Nagarkurnool", "Nalgonda", "Nirmal", "Nizamabad", "Peddapalli", "Rajanna Sircilla", "Rangareddy", "Sangareddy", "Siddipet", "Suryapet", "Vikarabad", "Wanaparthy", "Warangal Rural", "Warangal Urban", "Yadadri Bhuvanagiri"],
  "Tripura": ["Dhalai", "Gomati", "Khowai", "North Tripura", "Sepahijala", "South Tripura", "Unakoti", "West Tripura"],
  "Uttar Pradesh": ["Agra", "Aligarh", "Allahabad", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya", "Azamgarh", "Baghpat", "Bahraich", "Ballia", "Balrampur", "Banda", "Barabanki", "Bareilly", "Basti", "Bhadohi", "Bijnor", "Budaun", "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria", "Etah", "Etawah", "Faizabad", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar", "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", "Hapur", "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Kannauj", "Kanpur Dehat", "Kanpur Nagar", "Kasganj", "Kaushambi", "Kheri", "Kushinagar", "Lalitpur", "Lucknow", "Maharajganj", "Mahoba", "Mainpuri", "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit", "Pratapgarh", "Raebareli", "Rampur", "Saharanpur", "Sambhal", "Sant Kabir Nagar", "Shahjahanpur", "Shamli", "Shravasti", "Siddharthnagar", "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"],
  "Uttarakhand": ["Almora", "Bageshwar", "Chamoli", "Champawat", "Dehradun", "Haridwar", "Nainital", "Pauri Garhwal", "Pithoragarh", "Rudraprayag", "Tehri Garhwal", "Udham Singh Nagar", "Uttarkashi"],
  "West Bengal": ["Alipurduar", "Bankura", "Birbhum", "Cooch Behar", "Dakshin Dinajpur", "Darjeeling", "Hooghly", "Howrah", "Jalpaiguri", "Jhargram", "Kalimpong", "Kolkata", "Malda", "Murshidabad", "Nadia", "North 24 Parganas", "Paschim Bardhaman", "Paschim Medinipur", "Purba Bardhaman", "Purba Medinipur", "Purulia", "South 24 Parganas", "Uttar Dinajpur"],
  "Andaman and Nicobar Islands": ["Nicobar", "North and Middle Andaman", "South Andaman"],
  "Chandigarh": ["Chandigarh"],
  "Dadra and Nagar Haveli and Daman and Diu": ["Dadra and Nagar Haveli", "Daman", "Diu"],
  "Delhi": ["Central Delhi", "East Delhi", "New Delhi", "North Delhi", "North East Delhi", "North West Delhi", "Shahdara", "South Delhi", "South East Delhi", "South West Delhi", "West Delhi"],
  "Jammu and Kashmir": ["Anantnag", "Bandipora", "Baramulla", "Budgam", "Doda", "Ganderbal", "Jammu", "Kathua", "Kishtwar", "Kulgam", "Kupwara", "Poonch", "Pulwama", "Rajouri", "Ramban", "Reasi", "Samba", "Shopian", "Srinagar", "Udhampur"],
  "Ladakh": ["Kargil", "Leh"],
  "Lakshadweep": ["Lakshadweep"],
  "Puducherry": ["Karaikal", "Mahe", "Puducherry", "Yanam"]
};

const CATEGORIES = [
  { label: "General", value: "General" },
  { label: "OBC (Other Backward Class)", value: "OBC" },
  { label: "SC (Scheduled Caste)", value: "SC" },
  { label: "ST (Scheduled Tribe)", value: "ST" },
  { label: "EWS (Economically Weaker Section)", value: "EWS" },
  { label: "PVTG (Particularly Vulnerable Tribal Groups)", value: "PVTG" },
  { label: "DNT (Denotified Tribes)", value: "DNT" },
  { label: "NT (Nomadic Tribes)", value: "NT" },
  { label: "SBC (Special Backward Classes)", value: "SBC" },
  { label: "VJ (Vimukta Jati)", value: "VJ" },
  { label: "MBC (Most Backward Class)", value: "MBC" }
];

const OCCUPATIONS = [
  { label: "Farmer / Agriculturist", value: "Farmer", icon: Store },
  { label: "Student", value: "Student", icon: School },
  { label: "Daily Wage Worker", value: "Worker", icon: Briefcase },
  { label: "Small Business Owner", value: "Business", icon: Store },
  { label: "Unemployed", value: "Unemployed", icon: User },
  { label: "Homemaker", value: "Homemaker", icon: HeartHandshake },
  { label: "Government Employee", value: "GovtEmployee", icon: Building2 },
  { label: "Private Sector Employee", value: "PrivateEmployee", icon: Building2 },
  { label: "Gig Worker / Delivery", value: "GigWorker", icon: MapPin },
  { label: "Construction Worker", value: "Construction", icon: Briefcase },
  { label: "Street Vendor", value: "Vendor", icon: Store },
  { label: "Teacher / Educator", value: "Teacher", icon: School },
  { label: "Healthcare Worker", value: "Healthcare", icon: HeartHandshake },
  { label: "Artisan / Craftsman", value: "Artisan", icon: User },
  { label: "Retired / Pensioner", value: "Retired", icon: User },
  { label: "Driver", value: "Driver", icon: Briefcase },
  { label: "Armed Forces / Defence", value: "Defence", icon: ShieldCheck },
  { label: "Other", value: "Other", icon: User }
];

export default function ProfileWizardScreen({ onNavigate, updateProfile, userProfile }: Props) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stateSearch, setStateSearch] = useState('');
  const [districtSearch, setDistrictSearch] = useState('');
  const [categorySearch, setCategorySearch] = useState('');
  const [occupationSearch, setOccupationSearch] = useState('');
  const lang = userProfile.language;

  const currentStep = steps[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      onNavigate(ScreenName.DASHBOARD);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    } else {
      onNavigate(ScreenName.PROFILE_METHOD);
    }
  };

  const isStepComplete = () => {
    switch (currentStep.id) {
      case 'age': return !!userProfile.ageRange;
      case 'state': return !!userProfile.state;
      case 'district': return !!userProfile.district;
      case 'occupation': return !!userProfile.occupation;
      case 'income': return !!userProfile.income;
      case 'category': return !!userProfile.category;
      default: return true;
    }
  };

  const OptionCard = ({ label, icon: Icon, value, selectedValue, onChange }: any) => (
    <label className="relative block cursor-pointer group">
      <input 
        type="radio" 
        className="peer sr-only" 
        name={currentStep.id} 
        value={value}
        checked={selectedValue === value}
        onChange={() => onChange(value)}
      />
      <div className="flex items-center justify-between p-4 bg-white border-2 border-slate-100 rounded-xl transition-all duration-200 hover:border-primary/30 peer-checked:border-primary peer-checked:bg-primary/5">
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${selectedValue === value ? 'bg-primary text-white' : 'bg-blue-50 text-primary'}`}>
            <Icon className="w-5 h-5" />
          </div>
          <span className={`text-lg font-medium ${selectedValue === value ? 'text-primary' : 'text-slate-700'}`}>{label}</span>
        </div>
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${selectedValue === value ? 'bg-primary border-primary' : 'border-slate-300'}`}>
          <Check className={`w-3.5 h-3.5 text-white transition-opacity ${selectedValue === value ? 'opacity-100' : 'opacity-0'}`} />
        </div>
      </div>
    </label>
  );

  const renderStepContent = () => {
    switch (currentStep.id) {
      case 'age':
        return (
          <div className="space-y-3">
             <OptionCard label="Under 18" value="under_18" icon={School} selectedValue={userProfile.ageRange} onChange={(v: string) => updateProfile({ ageRange: v })} />
             <OptionCard label="18 - 35" value="18_35" icon={Briefcase} selectedValue={userProfile.ageRange} onChange={(v: string) => updateProfile({ ageRange: v })} />
             <OptionCard label="36 - 50" value="36_50" icon={Users} selectedValue={userProfile.ageRange} onChange={(v: string) => updateProfile({ ageRange: v })} />
             <OptionCard label="51 - 60" value="51_60" icon={HeartHandshake} selectedValue={userProfile.ageRange} onChange={(v: string) => updateProfile({ ageRange: v })} />
             <OptionCard label="Above 60" value="above_60" icon={User} selectedValue={userProfile.ageRange} onChange={(v: string) => updateProfile({ ageRange: v })} />
          </div>
        );
      case 'state':
        const filteredStates = INDIAN_STATES.filter(state => 
          state.toLowerCase().includes(stateSearch.toLowerCase())
        );
        return (
          <div className="space-y-4 h-full flex flex-col">
            <div className="relative flex-shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search state..." 
                className="w-full pl-10 pr-4 py-3 bg-white text-slate-900 rounded-xl border border-slate-200 outline-none focus:border-primary placeholder:text-slate-400"
                value={stateSearch}
                onChange={(e) => setStateSearch(e.target.value)}
              />
            </div>
            <div className="space-y-2 flex-1 overflow-y-auto no-scrollbar pb-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 sticky top-0 bg-white py-1 z-10">Select State</h3>
              <div className="space-y-2">
                {filteredStates.map(state => (
                   <OptionCard 
                     key={state} 
                     label={state} 
                     value={state} 
                     icon={() => <span className="text-[10px] font-bold w-full text-center">{state.substring(0,2).toUpperCase()}</span>} 
                     selectedValue={userProfile.state} 
                     onChange={(v: string) => {
                       updateProfile({ state: v, district: '' }); // Reset district when state changes
                     }} 
                   />
                ))}
                {filteredStates.length === 0 && (
                  <div className="text-center py-8 text-slate-500 text-sm bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    No state found matching "{stateSearch}"
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 'district':
        const selectedState = userProfile.state || "";
        const districts = STATE_DISTRICTS[selectedState] || [];
        const filteredDistricts = districts.filter(d => 
          d.toLowerCase().includes(districtSearch.toLowerCase())
        );

        return (
          <div className="space-y-4 h-full flex flex-col">
             <div className="text-xs font-bold text-slate-500 uppercase mb-1">{t('state', lang)}: {selectedState || 'Not Selected'}</div>
             <div className="relative flex-shrink-0">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
               <input 
                 type="text" 
                 placeholder="Search district..." 
                 className="w-full pl-10 pr-4 py-3 bg-white text-slate-900 rounded-xl border border-slate-200 outline-none focus:border-primary placeholder:text-slate-400"
                 value={districtSearch}
                 onChange={(e) => setDistrictSearch(e.target.value)}
               />
             </div>

             <div className="space-y-2 flex-1 overflow-y-auto no-scrollbar pb-4">
                {filteredDistricts.length > 0 ? (
                  filteredDistricts.map(district => (
                    <OptionCard 
                      key={district} 
                      label={district} 
                      value={district} 
                      icon={Building2} 
                      selectedValue={userProfile.district} 
                      onChange={(v: string) => updateProfile({ district: v })} 
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-500 text-sm bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    {districts.length === 0 
                      ? "Please select a valid state first." 
                      : `No district found matching "${districtSearch}"`
                    }
                  </div>
                )}
             </div>
          </div>
        );
      case 'occupation':
        const filteredOccupations = OCCUPATIONS.filter(o => 
          o.label.toLowerCase().includes(occupationSearch.toLowerCase())
        );

        return (
          <div className="space-y-4 h-full flex flex-col">
             <div className="relative flex-shrink-0">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
               <input 
                 type="text" 
                 placeholder="Search occupation..." 
                 className="w-full pl-10 pr-4 py-3 bg-white text-slate-900 rounded-xl border border-slate-200 outline-none focus:border-primary placeholder:text-slate-400"
                 value={occupationSearch}
                 onChange={(e) => setOccupationSearch(e.target.value)}
               />
             </div>
             
             <div className="space-y-2 flex-1 overflow-y-auto no-scrollbar pb-4">
                {filteredOccupations.map(occ => (
                   <OptionCard 
                     key={occ.value} 
                     label={occ.label} 
                     value={occ.value} 
                     icon={occ.icon} 
                     selectedValue={userProfile.occupation} 
                     onChange={(v: string) => updateProfile({ occupation: v })} 
                   />
                ))}
                
                {filteredOccupations.length === 0 && (
                  <div className="text-center py-8 text-slate-500 text-sm bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    No occupation found matching "{occupationSearch}"
                  </div>
                )}
             </div>
          </div>
        );
      case 'income':
         return (
          <div className="space-y-3">
             <div className="flex gap-3 bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
                <div className="text-primary"><HeartHandshake className="w-5 h-5" /></div>
                <p className="text-xs text-slate-600">Income helps determine eligibility for specific financial assistance schemes.</p>
             </div>
             <OptionCard label="Below ₹2.5 Lakh" value="low" icon={() => <span className="font-bold">₹</span>} selectedValue={userProfile.income} onChange={(v: string) => updateProfile({ income: v })} />
             <OptionCard label="₹2.5L - ₹5L" value="mid_low" icon={() => <span className="font-bold">₹</span>} selectedValue={userProfile.income} onChange={(v: string) => updateProfile({ income: v })} />
             <OptionCard label="₹5L - ₹8L" value="mid_high" icon={() => <span className="font-bold">₹</span>} selectedValue={userProfile.income} onChange={(v: string) => updateProfile({ income: v })} />
             <OptionCard label="Above ₹8L" value="high" icon={() => <span className="font-bold">₹</span>} selectedValue={userProfile.income} onChange={(v: string) => updateProfile({ income: v })} />
          </div>
         );
      case 'category':
        const filteredCategories = CATEGORIES.filter(c => 
          c.label.toLowerCase().includes(categorySearch.toLowerCase())
        );

        return (
          <div className="space-y-4 h-full flex flex-col">
             <div className="relative flex-shrink-0">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
               <input 
                 type="text" 
                 placeholder="Search category..." 
                 className="w-full pl-10 pr-4 py-3 bg-white text-slate-900 rounded-xl border border-slate-200 outline-none focus:border-primary placeholder:text-slate-400"
                 value={categorySearch}
                 onChange={(e) => setCategorySearch(e.target.value)}
               />
             </div>
             
             <div className="space-y-2 flex-1 overflow-y-auto no-scrollbar pb-4">
                {filteredCategories.map(cat => (
                   <OptionCard 
                     key={cat.value} 
                     label={cat.label} 
                     value={cat.value} 
                     icon={Users} 
                     selectedValue={userProfile.category} 
                     onChange={(v: string) => updateProfile({ category: v })} 
                   />
                ))}
                
                {filteredCategories.length === 0 && (
                  <div className="text-center py-8 text-slate-500 text-sm bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    No category found matching "{categorySearch}"
                  </div>
                )}
                
                <div className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-100 flex gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    <p className="text-xs text-slate-600">Selecting the correct category helps in finding specific social welfare schemes and reservation benefits applicable to you.</p>
                 </div>
             </div>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100">
        <button onClick={handleBack} className="p-2 -ml-2 rounded-full hover:bg-slate-100">
          <ArrowLeft className="w-6 h-6 text-primary" />
        </button>
        <h1 className="text-xs font-bold tracking-widest text-slate-900 uppercase">{t('profileSetup', lang)}</h1>
        <div className="w-8"></div>
      </div>

      <div className="px-6 pt-6 pb-2">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-primary">{t('step', lang)} {currentStepIndex + 1} {t('of', lang)} {steps.length}</span>
          <span className="text-xs font-medium text-slate-400">{currentStep.progress}% {t('completed', lang)}</span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
            style={{ width: `${currentStep.progress}%` }}
          ></div>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto px-6 py-4 pb-24 no-scrollbar">
        <div className="mb-6 mt-2">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">{t(currentStep.titleKey, lang)}</h2>
          <p className="text-sm text-slate-500">{t('w_age_sub', lang)}</p>
        </div>
        {renderStepContent()}
      </main>

      <div className="absolute bottom-0 left-0 w-full p-6 bg-white border-t border-slate-100 z-10">
        <Button onClick={handleNext} icon disabled={!isStepComplete()}>
          {currentStepIndex === steps.length - 1 ? t('findSchemes', lang) : t('nextStep', lang)}
        </Button>
      </div>
    </div>
  );
}