import pandas as pd
from sqlalchemy import create_engine
import numpy as np
from datetime import datetime
import pathlib


#before run this file, you need to copy only the table from 'Catastro Eq. Ind e Inst.' sheet to another sheet named 'Hoja5' and clean file, changing values 'S/N', 'Sin información' or '-' as ''
#change var path and conexion to sql

path = '/Users/jparedes/downloads/DB_GEC'
dir = pathlib.Path(path)
files= list(dir.glob('**/*.xlsx'))
date = datetime.today()
year = int(date.strftime("%Y"))
organizations = {
    'HHR': 17,
    'HDS': 1,
    'INRPAC': 6,
    'HLT': 2,
    'INCA': 5,
    'INGER': 7,
    'HLCM': 3
}
for file in files:
    excelFile = pd.ExcelFile(file)
    name = str(file.name)
    organization = name[0: name.index('Planilla') - 1]
    #read file and change column names to english
    print(organization)
    try: 
        df = pd.read_excel(file, 'Hoja5', usecols=['Serie', 'Marca', 'Nombre Equipo', 'Servicio Clínico', 'N° inventario', 'Clase', 'Subclase', 'Valor del equipo M$', 'Modelo', 'Año de Adquisición', 'Vida útil', 'Propio / Arriendo / Comodato', 'Estado (Bueno / Regular / Malo)', 'Crítico o Relevante'])
        df = df.rename(index=str, columns={"Serie": "series_number", 'Marca': 'brand', 'Nombre Equipo': 'name', 'Servicio Clínico': 'ubication', 'N° inventario':'inventory_number', 'Clase': 'clase', 'Subclase': 'subclase', 'Valor del equipo M$': 'cost_of_equipment', 'Modelo': 'model', 'Año de Adquisición': 'year_of_acquisition', 'Vida útil': 'useful_life', 'Propio / Arriendo / Comodato': 'possession', 'Estado (Bueno / Regular / Malo)': 'status', 'Crítico o Relevante': 'critic'})
    except: 
        try: 
            df = pd.read_excel(file, 'Hoja5', usecols=['Serie', 'Marca', 'Nombre Equipo', 'Servicio Clínico', 'N° inventario', 'Clase', 'Subclase', 'Valor del equipo M$', 'Modelo', 'Año de Instalación en el EAS/EAPS', 'Vida útil', 'Propio / Arriendo / Comodato', 'Estado (Bueno / Regular / Malo)', 'Crítico o Relevante'])
            df = df.rename(index=str, columns={"Serie": "series_number", 'Marca': 'brand', 'Nombre Equipo': 'name', 'Servicio Clínico': 'ubication', 'N° inventario':'inventory_number', 'Clase': 'clase', 'Subclase': 'subclase', 'Valor del equipo M$': 'cost_of_equipment', 'Modelo': 'model', 'Año de Instalación en el EAS/EAPS': 'year_of_acquisition', 'Vida útil': 'useful_life', 'Propio / Arriendo / Comodato': 'possession', 'Estado (Bueno / Regular / Malo)': 'status', 'Crítico o Relevante': 'critic'})
        except: 
            try:
                df = pd.read_excel(file, 'Hoja5', usecols=['Serie', 'Marca', 'Nombre Equipo / Planta Física / Instalación', 'Ubicación', 'N° inventario', 'Clase', 'Subclase', 'Valor del equipo M$', 'Modelo', 'Año de Instalación en el EAS/EAPS', 'Vida útil', 'Propio / Arriendo / Comodato', 'Estado (Bueno / Regular / Malo)', 'Crítico o Relevante'])
                df = df.rename(index=str, columns={"Serie": "series_number", 'Marca': 'brand', 'Nombre Equipo / Planta Física / Instalación': 'name', 'Ubicación': 'ubication', 'N° inventario':'inventory_number', 'Clase': 'clase', 'Subclase': 'subclase', 'Valor del equipo M$': 'cost_of_equipment', 'Modelo': 'model', 'Año de Instalación en el EAS/EAPS': 'year_of_acquisition', 'Vida útil': 'useful_life', 'Propio / Arriendo / Comodato': 'possession', 'Estado (Bueno / Regular / Malo)': 'status', 'Crítico o Relevante': 'critic'})
            except:
                try:
                    df = pd.read_excel(file, 'Hoja5', usecols=['Serie', 'Marca', 'Nombre Equipo', 'Servicio Clínico', 'N° inventario', 'Clase', 'Subclase', 'Valor del equipo M$', 'Modelo', 'Año de Adquisición', 'Vida útil', 'Propio / Arriendo / Comodato', 'Estado (Bueno / Regular / Malo)'])
                    df = df.rename(index=str, columns={"Serie": "series_number", 'Marca': 'brand', 'Nombre Equipo': 'name', 'Servicio Clínico': 'ubication', 'N° inventario':'inventory_number', 'Clase': 'clase', 'Subclase': 'subclase', 'Valor del equipo M$': 'cost_of_equipment', 'Modelo': 'model', 'Año de Adquisición': 'year_of_acquisition', 'Vida útil': 'useful_life', 'Propio / Arriendo / Comodato': 'possession', 'Estado (Bueno / Regular / Malo)': 'status'})
                except:
                    try:
                        df = pd.read_excel(file, 'Hoja5', usecols=['Serie', 'Marca', 'Nombre Equipo', 'Servicio Clínico', 'N° inventario', 'Clase', 'Subclase', 'Valor del equipo M$', 'Modelo', 'Año de Instalación en el EAS/EAPS', 'Vida útil', 'Propio / Arriendo / Comodato', 'Estado (Bueno / Regular / Malo)'])
                        df = df.rename(index=str, columns={"Serie": "series_number", 'Marca': 'brand', 'Nombre Equipo': 'name', 'Servicio Clínico': 'ubication', 'N° inventario':'inventory_number', 'Clase': 'clase', 'Subclase': 'subclase', 'Valor del equipo M$': 'cost_of_equipment', 'Modelo': 'model', 'Año de Instalación en el EAS/EAPS': 'year_of_acquisition', 'Vida útil': 'useful_life', 'Propio / Arriendo / Comodato': 'possession', 'Estado (Bueno / Regular / Malo)': 'status'})
                    except:
                        df = pd.read_excel(file, 'Hoja5', usecols=['Serie', 'Marca', 'Nombre Equipo / Planta Física / Instalación', 'Ubicación', 'N° inventario', 'Clase', 'Subclase', 'Valor del equipo M$', 'Modelo', 'Año de Instalación en el EAS/EAPS', 'Vida útil', 'Propio / Arriendo / Comodato', 'Estado (Bueno / Regular / Malo)'])
                        df = df.rename(index=str, columns={"Serie": "series_number", 'Marca': 'brand', 'Nombre Equipo / Planta Física / Instalación': 'name', 'Ubicación': 'ubication', 'N° inventario':'inventory_number', 'Clase': 'clase', 'Subclase': 'subclase', 'Valor del equipo M$': 'cost_of_equipment', 'Modelo': 'model', 'Año de Instalación en el EAS/EAPS': 'year_of_acquisition', 'Vida útil': 'useful_life', 'Propio / Arriendo / Comodato': 'possession', 'Estado (Bueno / Regular / Malo)': 'status'})
            

    #insert missing columns
    df.insert(8, 'active', 'operational')
    df.insert(10, 'createdAt', datetime.today())
    df.insert(11, 'updatedAt', datetime.today())
    df.insert(12, 'cost_of_maintenances', '0')    
    df.insert(13, 'organizationId', organizations[organization])

    df.insert(14, 'vur', np.nan)
    df.insert(15, 'year', year)

    #fixing a small problem: some values contains '$' sign 
    try: df.loc[df.cost_of_equipment.str[:1]== "$", 'cost_of_equipment'] = df.cost_of_equipment.str[1:]
    except: pass
    #changing 'S/N' values for NULL
    df.loc[df.cost_of_equipment == 'S/N','cost_of_equipment'] = np.nan 
    df.loc[df.model == 'S/N','model']= np.nan
    df.loc[df.series_number == 'S/N','series_number']= np.nan
    df.loc[df.series_number == 'S/S','series_number']= np.nan


    #calculating vur
    df.loc[(df.useful_life != np.nan) & (df.year_of_acquisition != np.nan), 'vur']= df.year_of_acquisition + df.useful_life - df.year
    df.loc[df.vur < 0,'vur']= 0


    #renaming some values
    #df['organizationId'] = df['organizationId'].map({'Hospital del Salvador': 1, 'Hospital Dr. Luis Tisné B.': 2, 'Hospital de Niños Dr. Luis Calvo Mackenna': 3, 'Instituto Nacional de Enfermedades Respiratorias y Cirugía Torácica': 4, 'Instituto de Neurocirugía Dr. Alfonso Asenjo': 5, 'Instituto Nacional de Rehabilitación Infantil Presidente Pedro Aguirre Cerda': 6, 'Instituto Nacional Geriátrico Presidente Eduardo Frei Montalva': 7, 'Centro de Referencia de Salud Cordillera Oriente': 8, 'COSAM La Reina': 9, 'COSAM Macul': 10, 'COSAM Ñuñoa': 11, 'COSAM Las Condes': 12, 'COSAM Peñalolén': 13, 'COSAM Provisam': 14, 'COSAM Lo Barnechea': 15, 'COSAM Vitacura': 16})
    df['possession'] = df['possession'].map({'PROPIO': 'own', 'Propio':'own', 'ARRIENDO': 'lease','Arriendo': 'lease', 'COMODATO': 'commodatum', 'comodato': 'commodatum'})
    df['status'] = df['status'].map({'BUENO': 'good', 'Bueno':'good', 'MALO': 'bad', 'Malo': 'bad', 'REGULAR': 'regular', 'Regular': 'regular'})
    df['clase'] = df['clase'].map({'Apoyo Diagnóstico': 'diagnosticSupport', 'Apoyo Endoscópico': 'endoscopicSupport', 'Apoyo Industrial': 'industrySupport', 'Apoyo Quirúrgico': 'surgicalSupport', 'Apoyo Terapéutico': 'therapeuticSupport', 'Esterilización': 'sterilization', 'Imagenología': 'imaging', 'Laboratorio/Farmac': 'laboratory/Pharmacy', 'Med. Fís. Rehabilitación': 'physMedRehabilitation', 'Monitoreo': 'monitoring', 'Odontología': 'odontology', 'Otra': 'other', 'Mobiliario': 'furniture',
        'Energia': 'energy', 'Transporte Vertical':'verticalTransport', 'Apoyo industrial': 'industrialSupport', 'Manejo de liquidos': 'liquidHandling', 'Comunicaciones': 'communications'})
    df['subclase'] = df['subclase'].map({'Alto Costo': 'highPrice', 'Mediano Costo': 'mediumCost', 'Bajo Costo': 'lowCost', 'Instrumental': 'instrumental', 'Clínico': 'clinical',
        'Pesaje': 'weighing', 'Refrigeración': 'refrigeration', 'Cocción': 'cooking', 'Picar': 'chop', 'Pelar': 'peel', 'Batir': 'shake', 'Extracción': 'extraction', 'Distribución': 'distribution', 'Lavado': 'washed', 'Descontaminación': 'decontamination', 'Centrifugación': 'centrifugation', 'Secado': 'drying', 'Planchado': 'ironing', 'Costura': 'sewing', 'Compresión': 'compression', 'Transporte de personas': 'peopleTransport', 'Transporte de carga': 'freightTransport', 'Eléctrica': 'electrical', 'Electrica': 'electrical', 'Calórica': 'caloric', 'Calorica': 'caloric', 'Elevación de aguas servidas': 'sewageElevation', 'Elevación de agua potable': 'drinkingWaterLift', 'Elevación de fluidos y agua caliente': 'FluidLiftAndHotWater', 'Radiocomunicación UHF': 'UHFRadioCommunication', 'Radiocomunicación VHF': 'VHFRadioCommunication', 'Radiocomunicación HF': 'HFRadioCommunication', 'Radiocomunicación vía microonda': 'RadioCommunicationViaMicrowave', 'Seguridad y vías de escape': 'safetyAndEscapeRoutes'})
    try: 
        df['critic'] = df['critic'].map({'Crítico': 'critic', 'Relevante': 'relevant'})
    except: pass

    df.drop('year', axis=1, inplace=True)


    #conection to sql
    engine = create_engine('postgresql://localhost:5432/GEC')
    df.to_sql('equipment', con=engine, if_exists='append', index=False)