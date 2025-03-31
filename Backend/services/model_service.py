import torch
import torchvision.transforms as transforms
import timm
import logging
from PIL import Image
from config import MODEL_WEIGHTS_PATH

logger = logging.getLogger(__name__)

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
logger.info(f"Using device: {device}")

class CustomEfficientNet(torch.nn.Module):
    def __init__(self, num_classes=206):  
        super(CustomEfficientNet, self).__init__()
        self.model = timm.create_model('efficientnet_b0', pretrained=True)
        self.model.classifier = torch.nn.Linear(self.model.num_features, num_classes)

    def forward(self, x):
        return self.model(x)

transform = transforms.Compose([
    transforms.Resize(224),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

def load_class_labels():
    try:
        raw_labels = ['aam_panna', 'adhirasam', 'aloo_gobi', 'aloo_matar', 'aloo_methi', 'aloo_pattice', 'aloo_shimla_mirch', 
                  'aloo_tikki', 'aloo_vadi', 'anarsa', 'appe', 'ariselu', 'baingan_bharta', 'bandar_laddu', 'barfi', 
                  'basundi', 'bebinca', 'beetroot_tikki', 'besan_ladoo', 'bhakarwadi', 'bhapa_doi', 'bhatura', 'bhel_puri', 
                  'bhindi_masala', 'biryani', 'bisi_bele_bath', 'bombay_aloo', 'boondi', 'bread_pakora', 'butter_chicken', 
                  'capsicum_curry', 'chaas', 'chai', 'chakli', 'chak_hao_kheer', 'cham_cham', 'chana_chaat', 'chana_masala', 
                  'chapati', 'chawal', 'cheela', 'cheese_naan', 'chicken_65', 'chicken_chilli', 'chicken_korma', 'chicken_lolipop', 
                  'chicken_razala', 'chicken_seekh_kebab', 'chicken_tikka', 'chicken_tikka_masala', 'chikki', 
                  'chilli_cheese_toastie', 'chole_bhature', 'chowmein', 'coconut_chutney', 'corn_cheese_balls', 
                  'daal_bhaati_churma', 'daal_puri', 'dabeli', 'dahi_bhalla', 'dahi_chaat', 'dal_makhani', 'dal_rice', 
                  'dal_tadka', 'dharwad_pedha', 'dhokla', 'doodhpak', 'double_ka_meetha', 'dum_aloo', 'egg_bhurji', 
                  'egg_curry', 'egg_fried_rice', 'fafda', 'falafel', 'falooda', 'fara', 'fish_curry', 'frankies', 
                  'fruit_custard', 'gajar_ka_halwa', 'galouti_kebab', 'gavvalu', 'ghevar', 'gobi_manchurian', 'gujiya', 
                  'gulab_jamun', 'gulgula', 'halwa', 'handvo', 'hara_bhara_kabab', 'idli_sambhar', 'imarti', 'jalebi', 
                  'jeera_rice', 'kachori', 'kadai_chicken', 'kadai_paneer', 'kadhi_chawal', 'kadhi_pakoda', 'kajjikaya', 
                  'kaju_katli', 'kakinada_khaja', 'kalakand', 'karela_bharta', 'kathal_curry', 'kathi_roll', 'keema', 
                  'khandvi', 'kheer', 'khichdi', 'kofta', 'kosha_mangsho', 'kulcha', 'kulfi', 'lassi', 'ledikeni', 
                  'lemon_rasam', 'lemon_rice', 'litti_chokha', 'lyangcha', 'maach_jhol', 'makki_di_roti_sarson_da_saag', 
                  'malai_chaap', 'malai_kofta', 'malapua', 'mango_chutney', 'mango_lassi', 'matar_paneer', 'misal_pav', 
                  'misi_roti', 'misti_doi', 'modak', 'momos', 'moong_dal_halwa', 'motichoor_ladoo', 'mushroom_curry', 
                  'mysore_masala_dosa', 'mysore_pak', 'naan', 'nankhatai', 'navratan_korma', 'neer_dosa', 'pakora', 
                  'palak_paneer', 'paneer_butter_masala', 'paneer_chilli', 'paneer_lababdar', 'paneer_tikka', 'pani_puri', 
                  'paratha', 'pav_bhaji', 'peda', 'phirni', 'pithe', 'poha', 'pongal', 'poornalu', 'pootharekulu', 
                  'prawn_curry', 'pulao', 'pumpkin_sabzi', 'puran_poli', 'qubani_ka_meetha', 'rabri', 'ragda_patties', 
                  'raita', 'rajma_chawal', 'rasam', 'rasgulla', 'ras_malai', 'rogan_josh', 'roti', 'sabudana_vada', 
                  'sambhar_vada', 'samosa', 'samosa_chaat', 'sandesh', 'sevayian', 'sev_puri', 'shahi_paneer', 'shahi_tukda', 
                  'shankarpali', 'sheera', 'sheer_korma', 'shrikhand', 'shwarma', 'sohan_halwa', 'sohan_papdi', 
                  'soya_chap_masala', 'sukat_chutney', 'sutar_feni', 'taak', 'tamarind_rice', 'tandoori_chicken', 
                  'thalipeeth', 'thandai', 'thepla', 'tikki_chaat', 'undhiyu', 'unni_appam', 'upma', 'uttapam', 'vada_pav', 
                  'veg_cutlet', 'veg_kolhapuri', 'vindaloo']
        
        class_labels = [label.replace("_", " ").title() for label in raw_labels]
        logger.info(f"Loaded {len(class_labels)} class labels")
        return class_labels
    except Exception as e:
        logger.error(f"Error loading class labels: {str(e)}")
        return []

def load_model():
    try:
        model = CustomEfficientNet().to(device)
        model.load_state_dict(torch.load(MODEL_WEIGHTS_PATH, map_location=device))
        model.eval()
        logger.info("Model loaded successfully")
        return model
    except Exception as e:
        logger.error(f"Error loading model: {str(e)}")
        return None

def predict_food_from_image(image):
    try:
        global model, class_labels
        
        if 'model' not in globals() or model is None:
            model = load_model()
        
        if 'class_labels' not in globals() or not class_labels:
            class_labels = load_class_labels()
            
        if not class_labels or model is None:
            logger.error("Model or class labels are not available")
            return None, 0.0

        if image.mode != 'RGB':
            image = image.convert('RGB')

        image_tensor = transform(image).unsqueeze(0).to(device)

        with torch.no_grad():
            outputs = model(image_tensor)
            probabilities = torch.nn.functional.softmax(outputs, dim=1)
            max_prob, predicted = torch.max(probabilities, 1)

            confidence = max_prob.item()
            predicted_class = class_labels[predicted.item()]

            logger.info(f"Model predicted {predicted_class} with confidence {confidence}")
            return predicted_class, confidence
    except Exception as e:
        logger.error(f"Error in model prediction: {str(e)}")
        return None, 0.0