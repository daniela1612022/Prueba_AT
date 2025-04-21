from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import pandas as pd
import io

@csrf_exempt
def analyze_csv(request):
    if request.method == 'POST' and request.FILES:
        business_file = request.FILES.get('business')
        demographics_file = request.FILES.get('demographics')

        if not business_file or not demographics_file:
            return JsonResponse({'error': 'Faltan archivos'}, status=400)

        try:
            businesses_df = pd.read_csv(io.StringIO(business_file.read().decode('utf-8')))
            demographics_df = pd.read_csv(io.StringIO(demographics_file.read().decode('utf-8')))

            businesses_df.rename(columns={"Address ZIP": "ZIP"}, inplace=True)
            demographics_df.rename(columns={"JURISDICTION NAME": "ZIP"}, inplace=True)

            businesses_df["ZIP"] = businesses_df["ZIP"].astype(str)
            demographics_df["ZIP"] = demographics_df["ZIP"].astype(str)

            business_count = businesses_df.groupby("ZIP").size().reset_index(name="business_count")
            merged_df = pd.merge(demographics_df, business_count, on="ZIP", how="left")
            merged_df["business_count"] = merged_df["business_count"].fillna(0)
            merged_df["business_per_capita"] = merged_df["business_count"] / (merged_df["COUNT PARTICIPANTS"] + 1)

            cols_to_check = [
                "PERCENT HISPANIC LATINO",
                "PERCENT BLACK NON HISPANIC",
                "PERCENT ASIAN NON HISPANIC",
                "PERCENT WHITE NON HISPANIC",
                "PERCENT FEMALE",
                "PERCENT US CITIZEN",
                "PERCENT RECEIVES PUBLIC ASSISTANCE",
                "business_count",
                "business_per_capita"
            ]
            correlations = merged_df[cols_to_check].corr().round(2).to_dict()

            def is_individual(name):
                corporate_keywords = ["LLC", "Inc", "Corp", "Company", "Ltd", "LLP", "PC", "LLLP", "S.A."]
                return not any(kw.lower() in str(name).lower() for kw in corporate_keywords)

            businesses_df["likely_individual"] = businesses_df["Business Name"].apply(is_individual)
            individual_counts = businesses_df[businesses_df["likely_individual"]].groupby("ZIP").size().reset_index(name="individual_count")
            merged_df = pd.merge(merged_df, individual_counts, on="ZIP", how="left")
            merged_df["individual_count"] = merged_df["individual_count"].fillna(0)
            merged_df["individual_ratio"] = merged_df["individual_count"] / (merged_df["business_count"] + 1)

            top_industries_zip = (
                businesses_df.groupby(["ZIP", "Industry"])
                .size()
                .reset_index(name="industry_count")
                .sort_values(["ZIP", "industry_count"], ascending=[True, False])
            )
            top_industries_by_zip = top_industries_zip.groupby("ZIP").head(5)

            # Agregar columnas demográficas para los gráficos de dispersión
            top_zips = merged_df.sort_values("business_count", ascending=False).head(10)[[
                "ZIP",
                "business_count",
                "business_per_capita",
                "individual_count",
                "individual_ratio",
                "PERCENT HISPANIC LATINO",
                "PERCENT RECEIVES PUBLIC ASSISTANCE"
            ]].to_dict(orient="records")

            return JsonResponse({
                "summary": {
                    "total_businesses": len(businesses_df),
                    "total_zip_codes": demographics_df["ZIP"].nunique(),
                    "avg_business_per_zip": round(merged_df["business_count"].mean(), 2)
                },
                "correlations": correlations,
                "sample_zip_data": top_zips,
                "top_industries_by_zip": top_industries_by_zip.to_dict(orient="records"),
                "message": "Archivos analizados correctamente"
            })

        except Exception as e:
            return JsonResponse({"error": f"Error procesando archivos: {str(e)}"}, status=500)

    return JsonResponse({'error': 'Método no permitido o archivos no encontrados'}, status=405)
