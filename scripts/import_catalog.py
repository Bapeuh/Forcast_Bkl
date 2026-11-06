from artifact_tool import Blob, SpreadsheetFile
from pathlib import Path
import json, re, zipfile, xml.etree.ElementTree as ET
source=Path(__file__).resolve().parents[2]/'Liste matos.xlsx'
out=Path(__file__).resolve().parents[1]/'data/catalog.json'
wb=SpreadsheetFile.import_xlsx(Blob.load(str(source)))
items=[]; templates={}
# Les valeurs proviennent de l'API tableur ; on récupère également les cibles
# des hyperliens via les métadonnées OOXML (sans modifier le classeur).
links_by_sheet={}
with zipfile.ZipFile(source) as archive:
 for number in range(1,4):
  sheet_xml=f'xl/worksheets/sheet{number}.xml'
  rel_xml=f'xl/worksheets/_rels/sheet{number}.xml.rels'
  if sheet_xml not in archive.namelist() or rel_xml not in archive.namelist():continue
  root=ET.fromstring(archive.read(sheet_xml))
  relroot=ET.fromstring(archive.read(rel_xml))
  rels={a.attrib['Id']:a.attrib.get('Target','') for a in relroot if 'hyperlink' in a.attrib.get('Type','')}
  rid='{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id'
  ns='{http://schemas.openxmlformats.org/spreadsheetml/2006/main}hyperlink'
  links_by_sheet[number]={h.attrib['ref']:rels.get(h.attrib.get(rid),'') for h in root.findall('.//'+ns)}
for sheet_num,sheet in enumerate(wb.worksheets.items,1):
 rows=sheet.get_range('A19:F80').values
 template=[]
 for rownum,row in enumerate(rows,19):
  name=row[1]; qty=row[2]; price=row[4]
  if not isinstance(name,str) or not name.strip() or not isinstance(qty,(int,float)):continue
  name=name.strip(); key=re.sub('[^a-z0-9]+','-',name.lower()).strip('-')[:66]
  known=next((i for i in items if i['id']==key),None)
  if not known:
   cat=('Casque VR' if 'pico' in name.lower() or 'htc' in name.lower() else
      'Réseau' if any(k in name.lower() for k in ['switch','routeur','controller','eap']) else
      'Informatique' if any(k in name.lower() for k in ['pc ','kvm','clavier','souris','ecran']) else
      'Fabrication' if any(k in name.lower() for k in ['lino','pvc','visserie']) else 'Accessoires')
   known={'id':key,'name':name,'category':cat,'price':float(price) if isinstance(price,(int,float)) else None,'status':'à vérifier','source':'Liste matos.xlsx / '+sheet.name,'url':links_by_sheet.get(sheet_num,{}).get('D'+str(rownum),'') or links_by_sheet.get(sheet_num,{}).get('B'+str(rownum),''),'notes':''}
   items.append(known)
  if not known.get('url'):
   known['url']=links_by_sheet.get(sheet_num,{}).get('D'+str(rownum),'') or links_by_sheet.get(sheet_num,{}).get('B'+str(rownum),'')
  template.append({'equipmentId':key,'qty':qty})
 templates[sheet.name]=template
# normalization of common auto-calculated references, not mistaken for supplier-verified prices
items += [
 {'id':'spare-battery','name':'Batterie spare','category':'Accessoires VR','price':None,'status':'à compléter','source':'Règle de dimensionnement','url':''},
 {'id':'battery-charger','name':'Chargeur de batteries','category':'Accessoires VR','price':None,'status':'à compléter','source':'Règle de dimensionnement','url':''},
 {'id':'vbms-pro','name':'VBMS Pro / Ultimate','category':'Licences','price':None,'status':'à compléter','source':'Règle HTC','url':''},
 {'id':'pc-client','name':'PC client VR','category':'Informatique','price':1980,'status':'à vérifier','source':'CAPEX (BASE PCVR)','url':''},
 {'id':'pc-server','name':'PC serveur','category':'Informatique','price':1980,'status':'à vérifier','source':'Hypothèse PCVR à valider','url':''},
 {'id':'wifi-ap','name':'Point d’accès Wi-Fi','category':'Réseau','price':209,'status':'à vérifier','source':'EAP772 dans fichier fourni','url':''},
 ]
out.write_text(json.dumps({'items':items,'templates':templates,'sourceFile':source.name,'note':'Tarifs historiques non actualisés; vérifier avant émission de devis'},ensure_ascii=False,indent=2),encoding='utf-8')
print(len(items),'articles',len(templates),'configurations')
